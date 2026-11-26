import type { ComponentPropsWithoutRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTranslations, isLocale, languages, resolveLocale, type Locale } from '../../../i18n'
import { Button, ButtonGroup } from '../../UI/Buttons'

export type LanguageSwitcherProps = ComponentPropsWithoutRef<'div'>

export function LanguageSwitcher({
  className,
  ...props
}: LanguageSwitcherProps) {
  const { locale: routeLocale } = useParams()
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  const locale = resolveLocale(routeLocale)

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
      aria-label={getTranslations(locale).layout.language}
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
