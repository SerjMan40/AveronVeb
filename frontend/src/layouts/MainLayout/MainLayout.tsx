import { useEffect, useState } from 'react'
import { IoArrowUpOutline } from 'react-icons/io5'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer/Footer'
import { Header } from '../components/Header/Header'
import { MainContent } from '../components/MainContent/MainContent'
import { isLocale } from '../../i18n/content'
import './MainLayout.scss'

export function MainLayout() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { pathname, hash, state } = useLocation()
  const preservedScrollY = (state as { preserveScrollY?: number } | null)?.preserveScrollY
  const localeSegment = pathname.split('/')[1]
  const locale = isLocale(localeSegment) ? localeSegment : 'uk'
  useEffect(() => {
    if (typeof preservedScrollY === 'number') {
      const frame = requestAnimationFrame(() => window.scrollTo({ top: preservedScrollY, left: 0 }))
      return () => cancelAnimationFrame(frame)
    }
    if (hash) {
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView())
      return
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash, preservedScrollY])

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 480)
    window.addEventListener('scroll', updateVisibility, { passive: true })
    updateVisibility()
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <div className="app-layout">
      <a className="app-layout__skip-link" href="#main-content">{{ uk: 'Перейти до вмісту', en: 'Skip to content', ru: 'Перейти к содержимому' }[locale]}</a>
      <Header />
      <MainContent id="main-content"><Outlet /></MainContent>
      <Footer />
      <button
        className={showBackToTop ? 'back-to-top back-to-top--visible' : 'back-to-top'}
        type="button"
        aria-label={{ uk: 'Повернутися нагору', en: 'Back to top', ru: 'Вернуться наверх' }[locale]}
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <IoArrowUpOutline aria-hidden="true" />
      </button>
    </div>
  )
}
