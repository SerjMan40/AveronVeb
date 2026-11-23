import { IoCloseOutline, IoMenuOutline } from 'react-icons/io5'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isLocale } from '../../../i18n/content'
import { HeaderLogo, MobileMenu, Navigation } from './components'
import { useMobileMenu } from './hooks'

export function Header() {
  const { isOpen, close, toggle } = useMobileMenu()
  const menuRef = useRef<HTMLDivElement>(null)
  const { locale: routeLocale } = useParams()
  const locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const accessible = { uk: { language: 'Мова', open: 'Відкрити меню', close: 'Закрити меню' }, en: { language: 'Language', open: 'Open menu', close: 'Close menu' }, ru: { language: 'Язык', open: 'Открыть меню', close: 'Закрыть меню' } }[locale]
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener('pointerdown', handleOutsideClick)
    return () => document.removeEventListener('pointerdown', handleOutsideClick)
  }, [close, isOpen])

  function changeLocale(nextLocale: string) {
    if (!isLocale(nextLocale)) return
    const destination = location.pathname.replace(/^\/(uk|en|ru)(?=\/|$)/, `/${nextLocale}`)
    navigate(`${destination}${location.search}${location.hash}`, { state: { preserveScrollY: window.scrollY } })
    close()
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <HeaderLogo />
        <div className="site-header__tools">
          <div className="language-switcher" role="group" aria-label={accessible.language}>{(['uk', 'ru', 'en'] as const).map((item) => <button type="button" className={locale === item ? 'language-switcher__active' : ''} aria-pressed={locale === item} onClick={() => changeLocale(item)} key={item}>{item === 'uk' ? 'UA' : item.toUpperCase()}</button>)}</div>
          <div ref={menuRef} className="site-header__menu">
            <button className="site-header__menu-toggle" type="button" aria-label={isOpen ? accessible.close : accessible.open} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={toggle}>
              {isOpen ? <IoCloseOutline aria-hidden="true" /> : <IoMenuOutline aria-hidden="true" />}
            </button>
            <MobileMenu isOpen={isOpen}><div id="mobile-navigation"><Navigation onNavigate={close} /></div></MobileMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
