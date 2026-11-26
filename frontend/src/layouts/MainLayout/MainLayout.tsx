import { useEffect, useRef } from 'react'
import { IoArrowUpOutline } from 'react-icons/io5'
import { Outlet, useLocation } from 'react-router-dom'

import { Footer, Header, PageContainer } from '../components'
import { BackToTop, SkipLink } from '../../components/UI'
import { getTranslations } from '../../i18n'

import './MainLayout.scss'

export function MainLayout() {
  const { pathname, hash, key, state } = useLocation()
  const initialScroll = useRef(true)

  const localeSegment = pathname.split('/')[1]
  const { layout: labels } = getTranslations(localeSegment)

  const scrollState = state as { preserveScrollY?: number; smoothScroll?: boolean } | null
  const preservedScrollY = scrollState?.preserveScrollY
  const smoothScroll = scrollState?.smoothScroll === true

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (initialScroll.current) {
        initialScroll.current = false
        const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
        // Reloads use the browser's scroll restoration for the current entry.
        if (navigation?.type === 'reload') return
      }

      if (Number.isFinite(preservedScrollY)) {
        window.scrollTo({
          top: preservedScrollY,
          left: 0,
          behavior: 'instant',
        })
        return
      }

      if (hash) {
        let id = hash.slice(1)

        try {
          id = decodeURIComponent(id)
        } catch {
          // Use the original fragment if decoding fails.
        }

        const target = document.getElementById(id)

        if (target) {
          target.scrollIntoView({ behavior: smoothScroll ? 'auto' : 'instant' })
          return
        }
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smoothScroll ? 'auto' : 'instant',
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key, preservedScrollY, smoothScroll])

  return (
    <PageContainer>
      <SkipLink href="#main-content">{labels.skip}</SkipLink>

      <Header />

      <main
        id="main-content"
        className="app-layout__main"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <Footer />

      <BackToTop
        icon={<IoArrowUpOutline />}
        aria-label={labels.backToTop}
      />
    </PageContainer>
  )
}
