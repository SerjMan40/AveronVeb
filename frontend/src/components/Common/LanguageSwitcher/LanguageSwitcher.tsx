import { useState, type ComponentPropsWithoutRef, type MouseEvent } from 'react'
import { IoArrowForwardOutline } from 'react-icons/io5'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTranslations, languages, resolveLocale } from '../../../i18n'
import { ButtonGroup } from '../../UI/Buttons'
import { Stack } from '../../UI'
import { PopoverPanel } from '../PopoverPanel'

export type LanguageSwitcherProps = ComponentPropsWithoutRef<'div'> & {
  compactClassName?: string
}

export function LanguageSwitcher({
  className,
  compactClassName,
  ...props
}: LanguageSwitcherProps) {
  const { locale: routeLocale } = useParams()
  const { search, hash } = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const locale = resolveLocale(routeLocale)
  const languageLabel = getTranslations(locale).layout.language
  const currentLanguage = languages.find(({ value }) => value === locale)

  function changeLocale(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    setIsOpen(false)

    const nextPath = event.currentTarget.pathname
    if (nextPath !== `/${locale}`) {
      navigate(`${nextPath}${search}${hash}`, {
        state: { preserveScrollY: window.scrollY },
      })
    }
  }

  return (
    <>
      <ButtonGroup
        {...props}
        className={className}
        aria-label={languageLabel}
      >
        {languages.map(({ value, label, name }) => (
          <a
            key={value}
            href={`/${value}`}
            lang={value}
            hrefLang={value}
            aria-label={name}
            aria-current={locale === value ? 'page' : undefined}
            className="ui-button ui-button--underline ui-button--sm"
            onClick={changeLocale}
          >
            {label}
          </a>
        ))}
      </ButtonGroup>
      {compactClassName && (
        <PopoverPanel
          className={compactClassName}
          open={isOpen}
          onOpenChange={setIsOpen}
          heading={languageLabel}
          triggerLabel={`${languageLabel}: ${currentLanguage?.name}`}
          trigger={currentLanguage?.label}
        >
          <Stack gap="2xs" className="language-switcher__options">
            {languages.map(({ value, label, name }) => (
              <a
                key={value}
                href={`/${value}`}
                lang={value}
                hrefLang={value}
                aria-current={locale === value ? 'page' : undefined}
                onClick={changeLocale}
              >
                <span className="ui-link__icon" aria-hidden="true">{label}</span>
                <span className="ui-link__content">{name}</span>
                <span className="ui-link__icon" aria-hidden="true"><IoArrowForwardOutline /></span>
              </a>
            ))}
          </Stack>
        </PopoverPanel>
      )}
    </>
  )
}
