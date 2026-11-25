export function formatNumber(
  value: number,
  locale?: string,
  options: Intl.NumberFormatOptions = {},
): string {
  if (!Number.isFinite(value)) {
    return ''
  }

  return new Intl.NumberFormat(locale, options).format(value)
}