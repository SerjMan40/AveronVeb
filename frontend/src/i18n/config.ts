export const languages = [
  { value: 'uk', label: 'UA', name: 'Українська' },
  { value: 'ru', label: 'RU', name: 'Русский' },
  { value: 'en', label: 'EN', name: 'English' },
] as const

export type Locale = (typeof languages)[number]['value']

export const locales = languages.map(language => language.value)
export const defaultLocale = 'uk' satisfies Locale

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.some(locale => locale === value)
}

export function resolveLocale(value?: string | null): Locale {
  return isLocale(value) ? value : defaultLocale
}

export function resolvePreferredLocale(preferences: readonly string[]): Locale {
  for (const preference of preferences) {
    const language = preference.toLowerCase().split('-')[0]
    if (isLocale(language)) return language
  }

  return defaultLocale
}
