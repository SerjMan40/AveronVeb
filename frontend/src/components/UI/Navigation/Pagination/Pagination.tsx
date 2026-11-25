import type {
  ComponentPropsWithoutRef,
} from 'react'

import { Button } from '../../Buttons/Button'

import { classNames } from '../../../../Utils'

import './Pagination.scss'

export type PaginationSize =
  | 'sm'
  | 'md'
  | 'lg'

export interface PaginationLabels {
  navigation: string
  first: string
  previous: string
  next: string
  last: string
  page: (page: number) => string
}

export interface PaginationProps
  extends Omit<
    ComponentPropsWithoutRef<'nav'>,
    'children' | 'onChange'
  > {
  page: number
  totalPages: number
  onChange: (page: number) => void
  siblingCount?: number
  boundaryCount?: number
  size?: PaginationSize
  showFirstLast?: boolean
  hideOnSinglePage?: boolean
  disabled?: boolean
  labels?: Partial<PaginationLabels>
}

type PaginationItem =
  | number
  | 'start-ellipsis'
  | 'end-ellipsis'

const defaultLabels: PaginationLabels = {
  navigation: 'Pagination',
  first: 'First page',
  previous: 'Previous page',
  next: 'Next page',
  last: 'Last page',
  page: page => 'Page ' + page,
}

function normalizeInteger(
  value: number,
  fallback: number,
  minimum: number,
  maximum = Number.MAX_SAFE_INTEGER,
): number {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.min(
    maximum,
    Math.max(minimum, Math.floor(value)),
  )
}

function range(
  start: number,
  end: number,
): number[] {
  return Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, index) => start + index,
  )
}

function getPaginationItems(
  page: number,
  total: number,
  siblings: number,
  boundaries: number,
): PaginationItem[] {
  const visible = new Set<number>([
    ...range(1, Math.min(boundaries, total)),
    ...range(
      Math.max(1, page - siblings),
      Math.min(total, page + siblings),
    ),
    ...range(
      Math.max(1, total - boundaries + 1),
      total,
    ),
  ])

  const sorted = [...visible].sort(
    (first, second) => first - second,
  )

  const result: PaginationItem[] = []

  sorted.forEach((value, index) => {
    const previous = sorted[index - 1]

    if (previous !== undefined) {
      const difference = value - previous

      if (difference === 2) {
        result.push(previous + 1)
      } else if (difference > 2) {
        result.push(
          value <= page
            ? 'start-ellipsis'
            : 'end-ellipsis',
        )
      }
    }

    result.push(value)
  })

  return result
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  size = 'md',
  showFirstLast = false,
  hideOnSinglePage = true,
  disabled = false,
  labels,
  className,
  ...props
}: PaginationProps) {
  const total = normalizeInteger(
    totalPages,
    0,
    0,
  )

  const current = normalizeInteger(
    page,
    1,
    1,
    Math.max(1, total),
  )

  const siblings = normalizeInteger(
    siblingCount,
    1,
    0,
    10,
  )

  const boundaries = normalizeInteger(
    boundaryCount,
    1,
    1,
    10,
  )

  const text = {
    ...defaultLabels,
    ...labels,
  }

  if (
    total === 0 ||
    (total === 1 && hideOnSinglePage)
  ) {
    return null
  }

  const items = getPaginationItems(
    current,
    total,
    siblings,
    boundaries,
  )

  function changePage(next: number) {
    if (
      !disabled &&
      next >= 1 &&
      next <= total &&
      next !== current
    ) {
      onChange(next)
    }
  }

  return (
    <nav
      {...props}
      aria-label={
        props['aria-label'] ?? text.navigation
      }
      className={classNames(
        'ui-pagination',
        className,
      )}
    >
      <ul className="ui-pagination__list">
        {showFirstLast && (
          <li>
            <Button
              size={size}
              variant="outline"
              disabled={disabled || current === 1}
              aria-label={text.first}
              onClick={() => changePage(1)}
            >
              «
            </Button>
          </li>
        )}

        <li>
          <Button
            size={size}
            variant="outline"
            disabled={disabled || current === 1}
            aria-label={text.previous}
            onClick={() => changePage(current - 1)}
          >
            ‹
          </Button>
        </li>

        {items.map(item => (
          <li key={item}>
            {typeof item === 'number' ? (
              <Button
                size={size}
                variant={
                  item === current
                    ? 'primary'
                    : 'outline'
                }
                disabled={disabled}
                aria-label={text.page(item)}
                aria-current={
                  item === current
                    ? 'page'
                    : undefined
                }
                className="ui-pagination__page"
                onClick={() => changePage(item)}
              >
                {item}
              </Button>
            ) : (
              <span
                className="ui-pagination__ellipsis"
                aria-hidden="true"
              >
                …
              </span>
            )}
          </li>
        ))}

        <li>
          <Button
            size={size}
            variant="outline"
            disabled={disabled || current === total}
            aria-label={text.next}
            onClick={() => changePage(current + 1)}
          >
            ›
          </Button>
        </li>

        {showFirstLast && (
          <li>
            <Button
              size={size}
              variant="outline"
              disabled={disabled || current === total}
              aria-label={text.last}
              onClick={() => changePage(total)}
            >
              »
            </Button>
          </li>
        )}
      </ul>
    </nav>
  )
}
