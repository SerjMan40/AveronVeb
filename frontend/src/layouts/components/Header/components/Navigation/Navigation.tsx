import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { isLocale, siteContent } from '../../../../../i18n/content'
import { classNames } from '../../../../../utils/helpers/classNames'
import './Navigation.scss'

type NavigationProps = { onNavigate?: () => void; className?: string }
const items = [
  { key: 'home', id: 'home' },
  { key: 'services', id: 'services' },
  { key: 'work', id: 'work' },
  { key: 'process', id: 'process' },
  { key: 'contact', id: 'contact' },
] as const
const homeLabels = { uk: 'Головна', en: 'Home', ru: 'Главная' } as const

export function Navigation({ onNavigate, className }: NavigationProps) {
  const { locale: routeLocale } = useParams()
  const { pathname } = useLocation()
  const locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const updateActiveSection = () => {
      const sections = items
        .map(({ id }) => document.getElementById(id))
        .filter((section): section is HTMLElement => section instanceof HTMLElement)

      if (sections.length === 0) {
        setActiveId(null)
        return
      }

      const marker = window.innerHeight * 0.35
      const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= marker)
      setActiveId(current?.id ?? sections[0].id)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [pathname])

  return (
    <nav className={classNames('primary-navigation', className)} aria-label={siteContent[locale].footer.navigation}>
      {items.map(({ key, id }) => (
        <Link
          key={id}
          to={`/${locale}#${id}`}
          onClick={onNavigate}
          className={classNames('primary-navigation__link', activeId === id && 'primary-navigation__link--active')}
          aria-current={activeId === id ? 'location' : undefined}
        >
          <span>{key === 'home' ? homeLabels[locale] : siteContent[locale].nav[key]}</span>
        </Link>
      ))}
    </nav>
  )
}
