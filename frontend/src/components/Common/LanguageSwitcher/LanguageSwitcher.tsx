import type { ComponentPropsWithoutRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isLocale } from '../../../i18n/content'
import { Button, ButtonGroup } from '../../UI/Buttons'

const languages = [
  { value: 'uk', label: 'UA', name: 'Українська' },
  { value: 'ru', label: 'RU', name: 'Русский' },
  { value: 'en', label: 'EN', name: 'English' },
] as const

const accessibleLabels = {
  uk: 'Мова',
  en: 'Language',
  ru: 'Язык',
} as const

type Locale = (typeof languages)[number]['value']

export type LanguageSwitcherProps = ComponentPropsWithoutRef<'div'>

export function LanguageSwitcher({
  className,
  ...props
}: LanguageSwitcherProps) {
  const { locale: routeLocale } = useParams()
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  const locale = isLocale(routeLocale) ? routeLocale : 'uk'

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return

    const segments = pathname.split('/')

    if (isLocale(segments[1])) {
      segments[1] = nextLocale
    } else {
      segments.splice(1, 0, nextLocale)
    }

    navigate(`${segments.join('/')}${search}${hash}`, {
      state: { preserveScrollY: window.scrollY },
    })
  }

  return (
    <ButtonGroup
      {...props}
      className={className}
      aria-label={accessibleLabels[locale]}
    >
      {languages.map(({ value, label, name }) => (
        <Button
          key={value}
          type="button"
          lang={value}
          aria-label={name}
          aria-pressed={locale === value}
          size="sm"
          variant="underline"
          onClick={() => changeLocale(value)}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  )
}
