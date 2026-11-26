import { resolveLocale, type Locale } from './config'
import { en } from './dictionaries/en'
import { ru } from './dictionaries/ru'
import { uk } from './dictionaries/uk'
import type { Dictionary } from './types'

export { defaultLocale, isLocale, languages, locales, resolveLocale, resolvePreferredLocale } from './config'
export type { Locale } from './config'
export type { ProjectTranslation } from './types'

const dictionaries: Readonly<Record<Locale, Dictionary>> = { uk, en, ru }

export function getTranslations(locale?: string | null): Dictionary {
  return dictionaries[resolveLocale(locale)]
}
