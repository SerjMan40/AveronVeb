import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer/Footer'
import { Header } from '../components/Header/Header'
import { MainContent } from '../components/MainContent/MainContent'
import { isLocale } from '../../i18n/content'
import './MainLayout.scss'

export function MainLayout() {
  const { pathname, hash } = useLocation()
  const localeSegment = pathname.split('/')[1]
  const locale = isLocale(localeSegment) ? localeSegment : 'uk'
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView())
      return
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return (
    <div className="app-layout">
      <a className="app-layout__skip-link" href="#main-content">{{ uk: 'Перейти до вмісту', en: 'Skip to content', ru: 'Перейти к содержимому' }[locale]}</a>
      <Header />
      <MainContent id="main-content"><Outlet /></MainContent>
      <Footer />
    </div>
  )
}
