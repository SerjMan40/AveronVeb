import { Link, useParams } from 'react-router-dom'
import { isLocale, siteContent } from '../../../i18n/content'
import { HeaderLogo } from '../Header/components'
import './Footer.scss'

export function Footer() {
  const { locale: routeLocale } = useParams()
  const locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const t = siteContent[locale]
  const email = import.meta.env.VITE_PUBLIC_CONTACT_EMAIL?.trim()
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand"><HeaderLogo /><p>{t.footer.tagline}</p></div>
        <div className="site-footer__nav"><h2>{t.footer.navigation}</h2><Link to={`/${locale}#services`}>{t.nav.services}</Link><Link to={`/${locale}#work`}>{t.nav.work}</Link><Link to={`/${locale}#process`}>{t.nav.process}</Link></div>
        <div className="site-footer__contact"><h2>{t.footer.contact}</h2><Link to={`/${locale}#contact`}>{t.nav.contact}<span aria-hidden="true">↗</span></Link>{email && <a href={`mailto:${email}`}>{email}</a>}</div>
      </div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} AVERON WEB. {t.footer.rights}</span><div><Link to={`/${locale}/privacy`}>{t.footer.privacy}</Link><Link to={`/${locale}/terms`}>{t.footer.terms}</Link></div><span className="site-footer__signature">BUILD. LAUNCH. EVOLVE.</span></div>
    </footer>
  )
}
