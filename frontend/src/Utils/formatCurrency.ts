import { formatNumber } from './formatNumber'

export function formatCurrency(
  value: number,
  currency: string,
  locale?: string,
  options: Intl.NumberFormatOptions = {},
): string {
  return formatNumber(value, locale, {
    ...options,
    style: 'currency',
    currency,
  })
}