import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  IoBriefcaseOutline, IoCloseOutline, IoGitBranchOutline, IoHomeOutline,
  IoLayersOutline, IoMailOutline, IoMenuOutline,
  IoCallOutline,
} from 'react-icons/io5'
import { useParams } from 'react-router-dom'

import { getTranslations, resolveLocale } from '../../../i18n'
import {
  LanguageSwitcher,
  Logo,
  Navigation,
} from '../../../components/Common'
import { Divider, Icon, Link, Popover, Stack, Text } from '../../../components/UI'
import { ContentContainer } from '../containers'
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
      <ContentContainer size="2xl" className="site-header__inner">
        <Logo name="AVERON WEB" src="/brand/averon-logo.png" showName={false} href={`/${locale}`} smoothScroll />

        <Navigation
          {...navigationProps}
          className="site-header__desktop-navigation"
        />

        <div className="site-header__tools">
          <div className="site-header__phone">
            <Link href={contactPhoneHref} underline="none" leftIcon={<IoCallOutline />}>{contactPhone}</Link>
          </div>

          <Divider className="site-header__phone-divider" orientation="vertical" spacing="none" decorative />
          <LanguageSwitcher />

          <Popover
            className="site-header__navigation-popover"
            open={isOpen}
            onOpenChange={setIsOpen}
            align="end"
            appearance="accent"
            triggerLabel={isOpen ? layout.closeMenu : layout.openMenu}
            trigger={<Icon size="xl"><MenuIcon /></Icon>}
          >
            <Stack gap="xs">
              <Text size="xs" align="center" transform="uppercase" weight="semibold" color="secondary" aria-hidden="true">
                {navigationLabel}
              </Text>
              <Divider spacing="none" decorative />
              <Navigation
                {...navigationProps}
                orientation="vertical"
                appearance="panel"
                onNavigate={() => setIsOpen(false)}
              />
            </Stack>
          </Popover>
        </div>
      </ContentContainer>
    </header>
  )
}
