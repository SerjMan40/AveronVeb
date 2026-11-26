import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { PageHeader, Section } from '../../components/Common'
import { Alert, Badge, Container, Link, Paragraph, Stack } from '../../components/UI'
import { HeroSection } from './sections/Hero'
import { ServicesSection } from './sections/Services'
import { WorkSection } from './sections/Work'
import { ProcessSection } from './sections/Process'
import { ContactSection } from './sections/Contact'
import { defaultLocale, getTranslations, locales, resolveLocale, resolvePreferredLocale, type Locale } from '../../i18n'
import './HomePage.scss'
function usePageMetadata(locale: Locale) {
  const { metadata: { title, description }, services } = getTranslations(locale)

  useEffect(() => {
    document.documentElement.lang = locale

    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.append(element)
      }
      element.content = value
    }
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${window.location.origin}/${locale}`)

    const origin = window.location.origin
    const canonicalHref = `${origin}/${locale}`
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = canonicalHref

    document.head.querySelectorAll('link[data-hreflang="averon"]').forEach((node) => node.remove())
    for (const language of locales) {
      const alternate = document.createElement('link')
      alternate.rel = 'alternate'
      alternate.hreflang = language
      alternate.href = `${origin}/${language}`
      alternate.dataset.hreflang = 'averon'
      document.head.append(alternate)
    }
    const defaultAlternate = document.createElement('link')
    defaultAlternate.rel = 'alternate'
    defaultAlternate.hreflang = 'x-default'
    defaultAlternate.href = `${origin}/${defaultLocale}`
    defaultAlternate.dataset.hreflang = 'averon'
    document.head.append(defaultAlternate)
    const organizationScript = document.getElementById('averon-organization-schema')
    organizationScript?.remove()
    const schema = document.createElement('script')
    schema.id = 'averon-organization-schema'
    schema.type = 'application/ld+json'
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AVERON WEB',
      url: canonicalHref,
      description,
      knowsAbout: ['Website development', 'Web design', 'Website maintenance', 'Search engine optimization'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${services.title} ${services.titleAccent}`,
        itemListElement: services.items.map(([name, serviceDescription]) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name, description: serviceDescription },
        })),
      },
    })
    document.head.append(schema)
  }, [description, locale, services, title])
}

export function HomePage() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  usePageMetadata(locale)

  return (
    <>
      <HeroSection locale={locale} />
      <ServicesSection locale={locale} />
      <WorkSection locale={locale} />
      <ProcessSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  )
}

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const { legal: t, metadata } = getTranslations(locale)
  const descriptionText = type === 'privacy' ? metadata.privacyDescription : metadata.termsDescription
  const title = type === 'privacy' ? t.privacyTitle : t.termsTitle
  useEffect(() => {
    document.documentElement.lang = locale
    const ensureMeta = (selector: string, key: string, content: string, attribute: 'name' | 'property') => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element) }
      element.content = content
    }
    ensureMeta('meta[name="description"]', 'description', descriptionText, 'name')
    ensureMeta('meta[property="og:title"]', 'og:title', `${title} вЂ” AVERON WEB`, 'property')
    ensureMeta('meta[property="og:description"]', 'og:description', descriptionText, 'property')
    ensureMeta('meta[property="og:url"]', 'og:url', `${window.location.origin}/${locale}/${type}`, 'property')
    document.getElementById('averon-organization-schema')?.remove()
    const path = `/${locale}/${type}`
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
    canonical.href = `${window.location.origin}${path}`
    document.head.querySelectorAll('link[data-hreflang="averon"]').forEach((node) => node.remove())
    for (const language of locales) {
      const alternate = document.createElement('link')
      alternate.rel = 'alternate'
      alternate.hreflang = language
      alternate.href = `${window.location.origin}/${language}/${type}`
      alternate.dataset.hreflang = 'averon'
      document.head.append(alternate)
    }
    const defaultAlternate = document.createElement('link')
    defaultAlternate.rel = 'alternate'
    defaultAlternate.hreflang = 'x-default'
    defaultAlternate.href = `${window.location.origin}/${defaultLocale}/${type}`
    defaultAlternate.dataset.hreflang = 'averon'
    document.head.append(defaultAlternate)
  }, [descriptionText, locale, title, type])
  return (
    <Section>
      <Container size="lg">
        <Stack gap="lg" align="start">
          <Badge variant="primary">AVERON WEB</Badge>
          <PageHeader heading={title} />
          <Alert variant="warning">{t.draft}</Alert>
          <Paragraph>{type === 'privacy' ? t.privacy : t.terms}</Paragraph>
          <Link href={`/${locale}`}>{t.back}</Link>
        </Stack>
      </Container>
    </Section>
  )
}

export function LocaleRedirect() {
  const preferred = typeof navigator === 'undefined'
    ? defaultLocale
    : resolvePreferredLocale(navigator.languages.length > 0 ? navigator.languages : [navigator.language])
  return <Navigate replace to={`/${preferred}`} />
}
