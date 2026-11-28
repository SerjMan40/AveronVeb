import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { HeroSection } from './sections/Hero'
import { ServicesSection } from './sections/Services'
import { WorkSection } from './sections/Work'
import { ProcessSection } from './sections/Process'
import { ContactSection } from './sections/Contact'
import { defaultLocale, getTranslations, locales, resolveLocale, type Locale } from '../../i18n'
import './HomePage.scss'

function PageMetadata({ locale }: { locale: Locale }) {
  const { metadata: { title, description }, services } = getTranslations(locale)
  const origin = import.meta.env.AVERON_SITE_URL
  const canonical = origin && `${origin}/${locale}`

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AVERON WEB',
    url: origin || undefined,
    logo: origin ? `${origin}/brand/averon-logo.webp` : undefined,
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
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content="AVERON WEB" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {origin && (
        <>
          <meta property="og:url" content={canonical} />
          <link rel="canonical" href={canonical} />
          {locales.map(language => (
            <link key={language} rel="alternate" hrefLang={language} href={`${origin}/${language}`} />
          ))}
          <link rel="alternate" hrefLang="x-default" href={`${origin}/${defaultLocale}`} />
        </>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }}
      />
    </>
  )
}

export function HomePage() {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)

  return (
    <>
      <PageMetadata locale={locale} />
      <HeroSection locale={locale} />
      <ServicesSection locale={locale} />
      <WorkSection locale={locale} />
      <ProcessSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  )
}
