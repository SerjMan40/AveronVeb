import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  IoBriefcaseOutline, IoCloseOutline, IoGitBranchOutline, IoHomeOutline,
  IoLayersOutline, IoMailOutline, IoMenuOutline,
  IoArrowForwardOutline, IoCallOutline,
} from 'react-icons/io5'
import { useParams } from 'react-router-dom'

import { getTranslations, resolveLocale } from '../../../i18n'
import {
  LanguageSwitcher,
  Logo,
  Navigation,
} from '../../../components/Common'
import { PopoverPanel } from '../../../components/Common/PopoverPanel'
import { Container, Divider, Icon, Link } from '../../../components/UI'
import { contactPhone, contactPhoneHref } from '../contactPhone'
import { sectionIds } from '../sectionIds'

import './Header.scss'

const navigationIcons = {
  home: IoHomeOutline,
  services: IoLayersOutline,
  work: IoBriefcaseOutline,
  process: IoGitBranchOutline,
  contact: IoMailOutline,
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPhoneOpen, setIsPhoneOpen] = useState(false)
  const { locale: routeLocale } = useParams()

  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return

    const rootStyle = document.documentElement.style
    const updateHeight = () => {
      rootStyle.setProperty('--site-header-height', `${header.getBoundingClientRect().height}px`)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header, { box: 'border-box' })

    return () => {
      observer.disconnect()
      rootStyle.removeProperty('--site-header-height')
    }
  }, [])

  const locale = resolveLocale(routeLocale)
  const { nav, layout, footer } = getTranslations(locale)
  const navigationItems = useMemo(() => sectionIds.map(id => {
    const ItemIcon = navigationIcons[id]
    return { id, label: nav[id], icon: <ItemIcon /> }
  }), [nav])
  const navigationLabel = footer.navigation
  const navigationProps = {
    items: navigationItems,
    basePath: `/${locale}`,
    ariaLabel: navigationLabel,
    smoothScroll: true,
  }
  const MenuIcon = isOpen ? IoCloseOutline : IoMenuOutline

  return (
    <header ref={headerRef} className="site-header" data-theme="dark">
      <Container size="2xl" className="site-header__inner">
        <Logo name="AVERON WEB" src="/brand/averon-logo.webp" showName={false} href={`/${locale}`} smoothScroll />

        <Navigation
          {...navigationProps}
          className="site-header__desktop-navigation"
        />

        <div className="site-header__tools">
          <div className="site-header__phone">
            <Link href={contactPhoneHref} underline="none" leftIcon={<IoCallOutline />}>{contactPhone}</Link>
          </div>
          <PopoverPanel
            className="site-header__phone-popover"
            open={isPhoneOpen}
            onOpenChange={setIsPhoneOpen}
            heading={footer.contact}
            triggerLabel={footer.contact}
            trigger={<Icon size="xl"><IoCallOutline /></Icon>}
          >
            <Link
              className="site-header__phone-option"
              href={contactPhoneHref}
              variant="inherit"
              underline="none"
              leftIcon={<IoCallOutline />}
              rightIcon={<IoArrowForwardOutline />}
              onClick={() => setIsPhoneOpen(false)}
            >
              {contactPhone}
            </Link>
          </PopoverPanel>

          <Divider className="site-header__phone-divider" orientation="vertical" spacing="none" decorative />

          <PopoverPanel
            className="site-header__navigation-popover"
            open={isOpen}
            onOpenChange={setIsOpen}
            heading={navigationLabel}
            triggerLabel={isOpen ? layout.closeMenu : layout.openMenu}
            trigger={<Icon size="xl"><MenuIcon /></Icon>}
          >
            <Navigation
              {...navigationProps}
              orientation="vertical"
              appearance="panel"
              onNavigate={() => setIsOpen(false)}
            />
          </PopoverPanel>
          <LanguageSwitcher className="site-header__languages" compactClassName="site-header__language-popover" />
        </div>
      </Container>
    </header>
  )
}
