export function formatDate(
  value: Date | string | number,
  locale?: string,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
): string {
  const date = value instanceof Date
    ? value
    : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}