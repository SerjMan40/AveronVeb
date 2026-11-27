import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { HeroSection } from './sections/Hero'
import { ServicesSection } from './sections/Services'
import { WorkSection } from './sections/Work'
import { ProcessSection } from './sections/Process'
import { ContactSection } from './sections/Contact'
import { defaultLocale, getTranslations, locales, resolveLocale, type Locale } from '../../i18n'
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

export function LocaleRedirect() {
  return <Navigate replace to={`/${defaultLocale}`} />
}
