import { Link, useParams } from 'react-router-dom'
import { isLocale, siteContent } from '../../../../../i18n/content'
import { classNames } from '../../../../../utils/helpers/classNames'
import './Navigation.scss'

type NavigationProps = { onNavigate?: () => void; className?: string }
const items = [
  { key: 'services', id: 'services' },
  { key: 'work', id: 'work' },
  { key: 'process', id: 'process' },
] as const

export function Navigation({ onNavigate, className }: NavigationProps) {
  const { locale: routeLocale } = useParams()
  const locale = isLocale(routeLocale) ? routeLocale : 'uk'
  return (
    <nav className={classNames('primary-navigation', className)} aria-label={siteContent[locale].footer.navigation}>
      {items.map(({ key, id }) => (
        <Link key={id} to={`/${locale}#${id}`} onClick={onNavigate} className="primary-navigation__link">{siteContent[locale].nav[key]}</Link>
      ))}
    </nav>
  )
}
