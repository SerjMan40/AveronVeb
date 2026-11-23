import { IoCloseOutline, IoMenuOutline } from 'react-icons/io5'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { isLocale, locales, siteContent } from '../../../i18n/content'
import { HeaderLogo, MobileMenu, Navigation } from './components'
import { useMobileMenu } from './hooks'

export function Header() {
  const { isOpen, close, toggle } = useMobileMenu()
  const { locale: routeLocale } = useParams()
  const locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const copy = siteContent[locale]
  const accessible = { uk: { language: 'Мова', open: 'Відкрити меню', close: 'Закрити меню' }, en: { language: 'Language', open: 'Open menu', close: 'Close menu' }, ru: { language: 'Язык', open: 'Открыть меню', close: 'Закрыть меню' } }[locale]
  const location = useLocation()
  const navigate = useNavigate()

  function changeLocale(nextLocale: string) {
    if (!isLocale(nextLocale)) return
    const destination = location.pathname.replace(/^\/(uk|en|ru)(?=\/|$)/, `/${nextLocale}`)
    navigate(`${destination}${location.search}${location.hash}`)
    close()
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <HeaderLogo />
        <div className="site-header__desktop-nav"><Navigation /></div>
        <div className="site-header__tools">
          <label className="language-switcher"><span className="sr-only">{accessible.language}</span><select value={locale} onChange={(event) => changeLocale(event.target.value)} aria-label={accessible.language}>{locales.map((item) => <option value={item} key={item}>{item === 'uk' ? 'UA' : item.toUpperCase()}</option>)}</select></label>
          <Link className="header-cta" to={`/${locale}#contact`}>{copy.nav.contact}<span aria-hidden="true">↗</span></Link>
        </div>
        <button className="site-header__menu-toggle" type="button" aria-label={isOpen ? accessible.close : accessible.open} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={toggle}>
          {isOpen ? <IoCloseOutline aria-hidden="true" /> : <IoMenuOutline aria-hidden="true" />}
        </button>
        <MobileMenu isOpen={isOpen}><div id="mobile-navigation"><Navigation onNavigate={close} /><Link className="mobile-menu__cta" to={`/${locale}#contact`} onClick={close}>{copy.nav.contact}<span aria-hidden="true">↗</span></Link></div></MobileMenu>
      </div>
    </header>
  )
}
