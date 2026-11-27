import { useState, type ComponentPropsWithoutRef } from 'react'
import { IoArrowForwardOutline } from 'react-icons/io5'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTranslations, isLocale, languages, resolveLocale, type Locale } from '../../../i18n'
import { Button, ButtonGroup } from '../../UI/Buttons'
import { Divider, Popover, Stack, Text } from '../../UI'

export type LanguageSwitcherProps = ComponentPropsWithoutRef<'div'> & {
  compactClassName?: string
}

export function LanguageSwitcher({
  className,
  compactClassName,
  ...props
}: LanguageSwitcherProps) {
  const { locale: routeLocale } = useParams()
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const locale = resolveLocale(routeLocale)
  const languageLabel = getTranslations(locale).layout.language
  const currentLanguage = languages.find(({ value }) => value === locale)

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
    <>
      <ButtonGroup
        {...props}
        className={className}
        aria-label={languageLabel}
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
      {compactClassName && (
        <Popover
          className={compactClassName}
          open={isOpen}
          onOpenChange={setIsOpen}
          align="end"
          appearance="accent"
          triggerLabel={`${languageLabel}: ${currentLanguage?.name}`}
          trigger={currentLanguage?.label}
        >
          <Stack gap="xs">
            <Text size="xs" align="center" transform="uppercase" weight="semibold" color="secondary" aria-hidden="true">
              {languageLabel}
            </Text>
            <Divider spacing="none" decorative />
            <Stack gap="2xs" className="language-switcher__options">
              {languages.map(({ value, label, name }) => (
                <button
                  key={value}
                  type="button"
                  lang={value}
                  aria-pressed={locale === value}
                  onClick={() => {
                    setIsOpen(false)
                    changeLocale(value)
                  }}
                >
                  <span className="ui-link__icon" aria-hidden="true">{label}</span>
                  <span className="ui-link__content">{name}</span>
                  <span className="ui-link__icon" aria-hidden="true"><IoArrowForwardOutline /></span>
                </button>
              ))}
            </Stack>
          </Stack>
        </Popover>
      )}
    </>
  )
}
