import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { PageHeader, Section } from '../../components/Common'
import { Alert, Badge, Container, Link, Paragraph, Stack } from '../../components/UI'
import { HeroSection } from './sections/Hero'
import { ServicesSection } from './sections/Services'
import { WorkSection } from './sections/Work'
import { BuyoutSection, PartnershipSection, ProcessSection } from './sections/Process'
import { ContactSection } from './sections/Contact'
import { isLocale, siteContent, type Locale } from '../../i18n/content'
import './HomePage.scss'
function usePageMetadata(locale: Locale) {
  const title = {
    uk: 'AVERON WEB вЂ” Р РѕР·СЂРѕР±РєР° С‚Р° СЂРѕР·РІРёС‚РѕРє СЃР°Р№С‚С–РІ РґР»СЏ Р±С–Р·РЅРµСЃСѓ',
    en: 'AVERON WEB вЂ” Websites built to grow with your business',
    ru: 'AVERON WEB вЂ” Р Р°Р·СЂР°Р±РѕС‚РєР° Рё СЂР°Р·РІРёС‚РёРµ СЃР°Р№С‚РѕРІ РґР»СЏ Р±РёР·РЅРµСЃР°',
  }[locale]
  const description = {
    uk: 'РЎС‚РІРѕСЂРµРЅРЅСЏ, Р·Р°РїСѓСЃРє С– СЃСѓРїСЂРѕРІС–Рґ РїСЂРѕС„РµСЃС–Р№РЅРёС… СЃР°Р№С‚С–РІ РґР»СЏ Р±С–Р·РЅРµСЃСѓ. Р©РѕРјС–СЃСЏС‡РЅР° РјРѕРґРµР»СЊ СЃРїС–РІРїСЂР°С†С– С‚Р° РјРѕР¶Р»РёРІС–СЃС‚СЊ РІРёРєСѓРїСѓ.',
    en: 'Build, launch and evolve professional business websites with monthly development, ongoing care and an optional buyout.',
    ru: 'РЎРѕР·РґР°РЅРёРµ, Р·Р°РїСѓСЃРє Рё СЃРѕРїСЂРѕРІРѕР¶РґРµРЅРёРµ РїСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅС‹С… СЃР°Р№С‚РѕРІ РґР»СЏ Р±РёР·РЅРµСЃР°. Р•Р¶РµРјРµСЃСЏС‡РЅР°СЏ РјРѕРґРµР»СЊ СЃРѕС‚СЂСѓРґРЅРёС‡РµСЃС‚РІР° Рё РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РІС‹РєСѓРїР°.',
  }[locale]

  useEffect(() => {
    document.title = title
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
    for (const language of ['uk', 'en', 'ru'] as const) {
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
    defaultAlternate.href = `${origin}/uk`
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
        name: `${siteContent[locale].services.title} ${siteContent[locale].services.titleAccent}`,
        itemListElement: siteContent[locale].services.items.map(([name, serviceDescription]) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name, description: serviceDescription },
        })),
      },
    })
    document.head.append(schema)
  }, [description, locale, title])
}

export function HomePage() {
  const { locale: routeLocale } = useParams()
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'uk'
  usePageMetadata(locale)

  return (
    <>
      <HeroSection locale={locale} />
      <ServicesSection locale={locale} />
      <WorkSection locale={locale} />
      <ProcessSection locale={locale} />
      <PartnershipSection locale={locale} />
      <BuyoutSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  )
}

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const { locale: routeLocale } = useParams()
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const t = siteContent[locale].legal
  const title = type === 'privacy' ? t.privacyTitle : t.termsTitle
  useEffect(() => {
    document.title = `${title} вЂ” AVERON WEB`
    document.documentElement.lang = locale
    const descriptionText = type === 'privacy'
      ? { uk: 'Р†РЅС„РѕСЂРјР°С†С–СЏ РїСЂРѕ РѕР±СЂРѕР±РєСѓ Р·РІРµСЂРЅРµРЅСЊ С– РїРµСЂСЃРѕРЅР°Р»СЊРЅРёС… РґР°РЅРёС… AVERON WEB.', en: 'Information about inquiry and personal data handling by AVERON WEB.', ru: 'РРЅС„РѕСЂРјР°С†РёСЏ РѕР± РѕР±СЂР°Р±РѕС‚РєРµ РѕР±СЂР°С‰РµРЅРёР№ Рё РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… РґР°РЅРЅС‹С… AVERON WEB.' }[locale]
      : { uk: 'РЈРјРѕРІРё СЃРїС–РІРїСЂР°С†С– С‚Р° РІРёРєРѕСЂРёСЃС‚Р°РЅРЅСЏ РјР°С‚РµСЂС–Р°Р»С–РІ AVERON WEB.', en: 'Service and material use terms for AVERON WEB.', ru: 'РЈСЃР»РѕРІРёСЏ СЃРѕС‚СЂСѓРґРЅРёС‡РµСЃС‚РІР° Рё РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ РјР°С‚РµСЂРёР°Р»РѕРІ AVERON WEB.' }[locale]
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
    for (const language of ['uk', 'en', 'ru'] as const) {
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
    defaultAlternate.href = `${window.location.origin}/uk/${type}`
    defaultAlternate.dataset.hreflang = 'averon'
    document.head.append(defaultAlternate)
  }, [locale, title, type])
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
  const language = typeof navigator === 'undefined' ? 'uk' : navigator.languages?.join(',').toLowerCase() ?? navigator.language.toLowerCase()
  const preferred = language.includes('uk') ? 'uk' : language.includes('en') ? 'en' : language.includes('ru') ? 'ru' : 'uk'
  return <Navigate replace to={`/${preferred}`} />
}
