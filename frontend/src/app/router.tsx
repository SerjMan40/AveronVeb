import { createBrowserRouter, Navigate, redirect } from 'react-router-dom'
import { defaultLocale, isLocale } from '../i18n'
import { MainLayout } from '../layouts'
import { HomePage, LocaleRedirect } from '../pages/HomePage'

const defaultPath = `/${defaultLocale}`

export const router = createBrowserRouter([
  { path: '/', element: <LocaleRedirect /> },
  {
    path: '/:locale',
    element: <MainLayout />,
    loader: ({ params }) => isLocale(params.locale) ? null : redirect(defaultPath),
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <Navigate replace to={defaultPath} /> },
    ],
  },
  { path: '*', element: <Navigate replace to={defaultPath} /> },
])
