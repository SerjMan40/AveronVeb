import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { IoArrowForwardOutline } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'
import { Link } from '../../UI/Navigation/Link'
import { classNames } from '../../../Utils'

import './Navigation.scss'

export interface NavigationItem {
  id: string
  label: string
  icon?: ReactNode
}

export interface NavigationProps {
  items: readonly NavigationItem[]
  basePath?: string
  ariaLabel?: string
  orientation?: 'auto' | 'vertical'
  appearance?: 'default' | 'panel'
  smoothScroll?: boolean
  className?: string
  onNavigate?: () => void
}

export function Navigation({
  items,
  basePath,
  ariaLabel = 'Navigation',
  orientation = 'auto',
  appearance = 'default',
  smoothScroll = false,
  className,
  onNavigate,
}: NavigationProps) {
  const { pathname, hash } = useLocation()
  const [activeId, setActiveId] = useState<string | null>(null)

  const targetPath = basePath ?? pathname

  useEffect(() => {
    if (pathname !== targetPath) {
      setActiveId(null)
      return
    }

    const updateActiveSection = () => {
      const sections = items
        .map(({ id }) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null)

      const marker = window.innerHeight * 0.35

      const current = sections
        .reverse()
        .find((section) => section.getBoundingClientRect().top <= marker)

      setActiveId(current?.id ?? sections.at(-1)?.id ?? null)
    }

    updateActiveSection()

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [items, pathname, hash, targetPath])

  return (
    <nav
      className={classNames(
        'primary-navigation',
        orientation === 'vertical' && 'primary-navigation--vertical',
        appearance === 'panel' && 'primary-navigation--panel',
        className,
      )}
      aria-label={ariaLabel}
    >
      {items.map(({ id, label, icon }) => (
        <Link
          key={id}
          href={`${targetPath}#${id}`}
          state={smoothScroll ? { smoothScroll: true } : undefined}
          onClick={onNavigate}
          variant="inherit"
          underline="none"
          leftIcon={icon}
          rightIcon={appearance === 'panel' ? <IoArrowForwardOutline /> : undefined}
          className={classNames(
            'primary-navigation__link',
            activeId === id && 'primary-navigation__link--active',
          )}
          aria-current={activeId === id ? 'location' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
