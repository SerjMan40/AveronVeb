import { createBrowserRouter, Navigate, redirect } from 'react-router-dom'
import { isLocale } from '../i18n/content'
import { MainLayout } from '../layouts'
import { HomePage, LegalPage, LocaleRedirect } from '../pages/HomePage'

export const router = createBrowserRouter([
  { path: '/', element: <LocaleRedirect /> },
  {
    path: '/:locale',
    element: <MainLayout />,
    loader: ({ params }) => isLocale(params.locale) ? null : redirect('/uk'),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'privacy', element: <LegalPage type="privacy" /> },
      { path: 'terms', element: <LegalPage type="terms" /> },
      { path: '*', element: <Navigate replace to="/uk" /> },
    ],
  },
  { path: '*', element: <Navigate replace to="/uk" /> },
])
