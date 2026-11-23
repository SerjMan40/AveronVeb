import { Link, useParams } from 'react-router-dom'
import { isLocale } from '../../../../../i18n/content'
export function HeaderLogo() {
  const { locale: routeLocale } = useParams()
  const locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const homeLabel = { uk: 'AVERON WEB — на головну', en: 'AVERON WEB — home', ru: 'AVERON WEB — на главную' }[locale]
  return <Link className="header-logo" to={`/${locale}`} aria-label={homeLabel}><span className="header-logo__symbol">A<span /></span><span className="header-logo__wordmark">AVERON<small>WEB</small></span></Link>
}
