import { randomUUID } from 'node:crypto'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import react from '@vitejs/plugin-react'
import { build, type Plugin, type ResolvedConfig } from 'vite'
import { defaultLocale, locales } from '../../src/i18n/config.ts'

const rootPlaceholder = '<div id="root"></div>'
const renderedRoot = '<div id="root">'
const headPlaceholder = '<!--app-head-->'

export function prerender(origin: string | undefined): Plugin {
  let config: ResolvedConfig

  return {
    name: 'averon-prerender',
    apply: (_, env) => env.command === 'build' || env.isPreview === true,
    configResolved(resolved) {
      config = resolved
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost')
        const locale = locales.find(value => url.pathname === `/${value}/` || url.pathname === `/${value}.html`)
        if (url.pathname === '/' || url.pathname === '/index.html' || locale) {
          response.writeHead(308, { Location: `/${locale ?? defaultLocale}${url.search}` })
          response.end()
          return
        }
        next()
      })
    },
    async writeBundle() {
      const output = resolve(config.root, config.build.outDir)
      const template = await readFile(resolve(output, 'index.html'), 'utf8')
      if (!template.includes(rootPlaceholder) || !template.includes(headPlaceholder)) {
        throw new Error('Missing prerender placeholders in index.html')
      }

      const result = await build({
        configFile: false,
        root: config.root,
        mode: config.mode,
        define: config.define,
        plugins: [react()],
        build: { ssr: 'src/entry-prerender.tsx', write: false },
      })
      if (!('output' in result)) throw new Error('Expected one prerender bundle')
      const entry = result.output.find(chunk => chunk.type === 'chunk' && chunk.isEntry)
      if (!entry || entry.type !== 'chunk') throw new Error('Missing prerender entry')

      const modulePath = resolve(output, `.prerender-${randomUUID()}.mjs`)
      await writeFile(modulePath, entry.code, 'utf8')
      try {
        const { renderPage } = await import(pathToFileURL(modulePath).href) as typeof import('../../src/entry-prerender')
        for (const page of [...locales, '404'] as const) {
          const markup = renderPage(`/${page}`)
          const rootIndex = markup.indexOf(renderedRoot)
          if (rootIndex === -1) throw new Error(`Missing rendered root for /${page}`)

          const html = template
            .replace('<html lang="uk"', `<html lang="${page === '404' ? defaultLocale : page}"`)
            .replace(headPlaceholder, () => markup.slice(0, rootIndex))
            .replace(rootPlaceholder, () => markup.slice(rootIndex))
          await writeFile(resolve(output, `${page}.html`), html, 'utf8')
        }
      } finally {
        await unlink(modulePath)
      }

      const robots = 'User-agent: *\nAllow: /\n'
      if (!origin) {
        await writeFile(resolve(output, 'robots.txt'), robots, 'utf8')
        config.logger.warn('[seo] Set AVERON_SITE_URL to generate canonical URLs and a sitemap.')
        return
      }

      const alternates = [...locales.map(locale => ({ language: locale, path: locale })), {
        language: 'x-default',
        path: defaultLocale,
      }].map(({ language, path }) =>
        `    <xhtml:link rel="alternate" hreflang="${language}" href="${origin}/${path}"/>`,
      ).join('\n')
      const entries = locales.map(locale =>
        `  <url>\n    <loc>${origin}/${locale}</loc>\n${alternates}\n  </url>`,
      ).join('\n')
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`

      await Promise.all([
        writeFile(resolve(output, 'sitemap.xml'), sitemap, 'utf8'),
        writeFile(resolve(output, 'robots.txt'), `${robots}Sitemap: ${origin}/sitemap.xml\n`, 'utf8'),
      ])
    },
  }
}
