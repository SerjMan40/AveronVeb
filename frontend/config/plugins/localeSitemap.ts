import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

export function localeSitemap(configuredUrl?: string): Plugin {
  return {
    name: 'averon-locale-sitemap',
    apply: 'build',
    async closeBundle() {
      const siteUrl = configuredUrl?.trim()
      const output = resolve(process.cwd(), 'dist')
      await mkdir(output, { recursive: true })

      if (!siteUrl) {
        await writeFile(resolve(output, 'robots.txt'), 'User-agent: *\nAllow: /\n', 'utf8')
        console.warn('[seo] AVERON_SITE_URL is unset; generated robots.txt without a sitemap reference.')
        return
      }

      let base: string
      try {
        const parsed = new URL(siteUrl)
        if (parsed.protocol !== 'https:') throw new Error('HTTPS is required')
        base = parsed.origin
      } catch {
        throw new Error('AVERON_SITE_URL must be a valid HTTPS origin, for example https://averonweb.com')
      }

      const pagePaths = ['/uk', '/en', '/ru']
      const alternatesFor = (path: string) => {
        const slug = path.replace(/^\/(uk|en|ru)/, '')
        return ['uk', 'en', 'ru'].map((language) => `      <xhtml:link rel="alternate" hreflang="${language}" href="${base}/${language}${slug}" />`).join('\n')
      }
      const entries = pagePaths.map((path) => `  <url>\n    <loc>${base}${path}</loc>\n${path ? alternatesFor(path) : ''}\n  </url>`).join('\n')
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`
      await Promise.all([
        writeFile(resolve(output, 'sitemap.xml'), sitemap, 'utf8'),
        writeFile(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`, 'utf8'),
      ])
    },
  }
}
