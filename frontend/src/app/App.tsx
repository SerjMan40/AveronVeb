import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { defaultLocale, isLocale } from '../i18n'
import { MainLayout } from '../layouts'
import { HomePage } from '../pages/HomePage'

function LocaleLayout() {
  const { locale } = useParams()
  return isLocale(locale) ? <MainLayout /> : <NotFound />
}

function NotFound() {
  return (
    <main>
      <title>404 | Averon Web</title>
      <meta name="robots" content="noindex" />
      <h1>Сторінку не знайдено</h1>
      <a href={`/${defaultLocale}`}>На головну</a>
    </main>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={`/${defaultLocale}`} />} />
      <Route path="/:locale" element={<LocaleLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
