import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { isLocale, siteContent, type Locale } from '../i18n/content'
import './HomePage.scss'

type Project = (typeof siteContent)[Locale]['work']['projects'][number]

function usePageMetadata(locale: Locale) {
  const title = {
    uk: 'AVERON WEB — Розробка та розвиток сайтів для бізнесу',
    en: 'AVERON WEB — Websites built to grow with your business',
    ru: 'AVERON WEB — Разработка и развитие сайтов для бизнеса',
  }[locale]
  const description = {
    uk: 'Створення, запуск і супровід професійних сайтів для бізнесу. Щомісячна модель співпраці та можливість викупу.',
    en: 'Build, launch and evolve professional business websites with monthly development, ongoing care and an optional buyout.',
    ru: 'Создание, запуск и сопровождение профессиональных сайтов для бизнеса. Ежемесячная модель сотрудничества и возможность выкупа.',
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
        name: siteContent[locale].services.title,
        itemListElement: siteContent[locale].services.items.map(([name, serviceDescription]) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name, description: serviceDescription },
        })),
      },
    })
    document.head.append(schema)
  }, [description, locale, title])
}

function ProjectPreview({ kind, large = false }: { kind: string; large?: boolean }) {
  return (
    <div className={`project-art project-art--${kind}${large ? ' project-art--large' : ''}`} aria-hidden="true">
      <div className="project-art__browser"><i /><i /><i /><span>averon / concept</span></div>
      <div className="project-art__canvas">
        {kind === 'stay' && <><div className="project-art__sun" /><div className="project-art__headline">SLOW<br />DOWN</div><div className="project-art__landscape"><b /><i /></div><div className="project-art__pill" /></>}
        {kind === 'studio' && <><div className="project-art__studio-mark">ST<span>+</span></div><div className="project-art__studio-copy"><i /><i /><i /></div><div className="project-art__studio-block"><b /><i /></div></>}
        {kind === 'shop' && <><div className="project-art__shop-top"><i /><i /><i /></div><div className="project-art__shop-title" /><div className="project-art__products"><i /><i /><i /></div></>}
      </div>
    </div>
  )
}

function ProjectDialog({ project, copy, onClose }: { project: Project | null; copy: (typeof siteContent)[Locale]['work']; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (project && dialog && !dialog.open) dialog.showModal()
    if (!project && dialog?.open) dialog.close()
  }, [project])

  if (!project) return null
  return (
    <dialog ref={dialogRef} className="project-dialog" aria-label={project.name} onClose={onClose}>
      <button className="project-dialog__close" type="button" onClick={onClose} aria-label={copy.close}>×</button>
      <ProjectPreview kind={project.kind} large />
      <p className="eyebrow">{copy.conceptLabel}</p>
      <p className="project-dialog__category">{project.category}</p>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
    </dialog>
  )
}

export function HomePage() {
  const { locale: routeLocale } = useParams()
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const t = siteContent[locale]
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'success' | 'error'>('idle')
  usePageMetadata(locale)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
      message: String(formData.get('message') ?? ''),
      service: String(formData.get('service') ?? ''),
      consent: formData.get('consent') === 'on',
      website: String(formData.get('website') ?? ''),
      locale,
    }
    setSubmitting(true)
    setFormState('idle')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error('Contact submission failed')
      form.reset()
      setFormState('success')
    } catch {
      setFormState('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="home-page">
        <section className="hero section-wrap" id="home">
          <div className="hero__copy">
            <p className="eyebrow"><span className="eyebrow__dot" />{t.hero.eyebrow}</p>
            <h1>{t.hero.title} <span>{t.hero.titleAccent}</span></h1>
            <p className="hero__description">{t.hero.description}</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#contact">{t.hero.primary}</a>
            </div>
          </div>
          <div className="hero-visual" role="img" aria-label={t.hero.visualLabel}>
            <img className="hero-scene" src="/brand/hero-background.jpg" alt="" fetchPriority="high" />
          </div>
        </section>

        <section className="services-section section-wrap" id="services">
          <div className="section-heading section-heading--services">
            <div><h2>{t.services.title}</h2><p>{t.services.intro}</p></div>
          </div>
          <div className="service-grid">
            {t.services.items.map(([name, description], index) => (
              <article className="service-card" key={name}>
                <div className="service-card__top"><span>{String(index + 1).padStart(2, '0')}</span><span className="service-card__icon" aria-hidden="true">{['↗', '✳', '◌', '⌕', '＋'][index]}</span></div>
                <h3>{name}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="work-section section-wrap" id="work">
          <div className="section-heading section-heading--work">
            <div><h2>{t.work.title}</h2><p>{t.work.intro}</p></div>
          </div>
          <div className="project-grid">
            {t.work.projects.map((project, index) => (
              <article className={`project-card project-card--${project.kind}`} key={project.name}>
                <button className="project-card__preview" type="button" onClick={() => setSelectedProject(project)} aria-label={`${t.work.open}: ${project.name}`}>
                  <ProjectPreview kind={project.kind} />
                  <span className="project-card__open">↗</span>
                </button>
                <div className="project-card__meta"><span>{project.category}</span><span>{t.work.concept}</span></div>
                <button className="project-card__title" type="button" onClick={() => setSelectedProject(project)}><span>{project.name}</span><span aria-hidden="true">↗</span></button>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
          <ProjectDialog project={selectedProject} copy={t.work} onClose={() => setSelectedProject(null)} />
        </section>

        <section className="process-section section-wrap" id="process">
          <div className="section-heading section-heading--process">
            <div><h2>{t.process.title}</h2><p>{t.process.intro}</p></div>
          </div>
          <div className="process-layout">
            <aside className="model-card">
              <span className="model-card__badge">AVERON WEB <i>·</i> PARTNERSHIP</span>
              <div className="model-card__orbit" aria-hidden="true"><span>BUILD</span><span>LAUNCH</span><span>EVOLVE</span><i /></div>
              <h3>{t.process.modelTitle}</h3>
              <p>{t.process.modelText}</p>
              <div className="model-card__divider" />
              <p className="model-card__buyout">{t.process.buyout}</p>
            </aside>
            <ol className="process-list">
              {t.process.steps.map(([title, description], index) => (
                <li className="process-step" key={title}><span className="process-step__number">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div><span className="process-step__arrow" aria-hidden="true">↗</span></li>
              ))}
            </ol>
          </div>
          <p className="process-fineprint">{t.process.fineprint}</p>
        </section>

        <section className="contact-section section-wrap" id="contact">
          <div className="contact-intro"><h2>{t.contact.title}</h2><p>{t.contact.intro}</p><div className="contact-intro__signature"><span>AVERON WEB</span><i>Build. Launch. Evolve.</i></div></div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <label>{t.contact.name}<input autoComplete="name" name="name" placeholder={t.contact.namePlaceholder} required maxLength={100} /></label>
              <label>{t.contact.email}<input autoComplete="email" name="email" type="email" placeholder={t.contact.emailPlaceholder} required maxLength={254} /></label>
            </div>
            <div className="contact-form__row">
              <label>{t.contact.company}<input autoComplete="organization" name="company" placeholder={t.contact.companyPlaceholder} maxLength={140} /></label>
              <label>{t.contact.service}<select name="service" required defaultValue=""><option value="" disabled>{t.contact.choose}</option>{t.contact.options.map((option, index) => <option value={`service_${index + 1}`} key={option}>{option}</option>)}</select></label>
            </div>
            <label>{t.contact.message}<textarea name="message" placeholder={t.contact.messagePlaceholder} required minLength={20} maxLength={3000} rows={4} /></label>
            <label className="contact-form__honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="contact-form__bottom">
              <label className="contact-form__consent"><input type="checkbox" name="consent" required /><span>{t.contact.consent} <Link to={`/${locale}/privacy`}>{t.contact.privacy}</Link>.</span></label>
              <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? t.contact.sending : t.contact.submit}<span aria-hidden="true">↗</span></button>
            </div>
            <p className={`contact-form__status contact-form__status--${formState}`} role="status" aria-live="polite">{formState === 'success' ? t.contact.success : formState === 'error' ? t.contact.error : ''}</p>
          </form>
        </section>
      </div>
    </>
  )
}

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const { locale: routeLocale } = useParams()
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const t = siteContent[locale].legal
  const title = type === 'privacy' ? t.privacyTitle : t.termsTitle
  useEffect(() => {
    document.title = `${title} — AVERON WEB`
    document.documentElement.lang = locale
    const descriptionText = type === 'privacy'
      ? { uk: 'Інформація про обробку звернень і персональних даних AVERON WEB.', en: 'Information about inquiry and personal data handling by AVERON WEB.', ru: 'Информация об обработке обращений и персональных данных AVERON WEB.' }[locale]
      : { uk: 'Умови співпраці та використання матеріалів AVERON WEB.', en: 'Service and material use terms for AVERON WEB.', ru: 'Условия сотрудничества и использования материалов AVERON WEB.' }[locale]
    const ensureMeta = (selector: string, key: string, content: string, attribute: 'name' | 'property') => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element) }
      element.content = content
    }
    ensureMeta('meta[name="description"]', 'description', descriptionText, 'name')
    ensureMeta('meta[property="og:title"]', 'og:title', `${title} — AVERON WEB`, 'property')
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
  return <div className="legal-page section-wrap"><p className="eyebrow">AVERON WEB</p><h1>{title}</h1><p className="legal-page__draft">{t.draft}</p><p>{type === 'privacy' ? t.privacy : t.terms}</p><Link className="button button--quiet" to={`/${locale}`}>← {siteContent[locale].legal.back}</Link></div>
}

export function LocaleRedirect() {
  const language = typeof navigator === 'undefined' ? 'uk' : navigator.languages?.join(',').toLowerCase() ?? navigator.language.toLowerCase()
  const preferred = language.includes('uk') ? 'uk' : language.includes('en') ? 'en' : language.includes('ru') ? 'ru' : 'uk'
  return <Navigate replace to={`/${preferred}`} />
}
