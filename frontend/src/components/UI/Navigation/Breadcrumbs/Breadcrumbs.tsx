import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { Link } from '../Link'

import { classNames } from '../../../../Utils'

import './Breadcrumbs.scss'

export interface BreadcrumbItem {
  id: string
  label: ReactNode
  href?: string
  icon?: ReactNode
}

export interface BreadcrumbsProps
  extends Omit<
    ComponentPropsWithoutRef<'nav'>,
    'children'
  > {
  items: readonly BreadcrumbItem[]
  separator?: ReactNode
  ariaLabel?: string
}

export function Breadcrumbs({
  items,
  separator = '/',
  ariaLabel = 'Breadcrumbs',
  className,
  ...props
}: BreadcrumbsProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <nav
      {...props}
      aria-label={props['aria-label'] ?? ariaLabel}
      className={classNames(
        'ui-breadcrumbs',
        className,
      )}
    >
      <ol className="ui-breadcrumbs__list">
        {items.map((item, index) => {
          const isCurrent =
            index === items.length - 1

          const content = (
            <>
              {item.icon != null && (
                <span
                  className="ui-breadcrumbs__icon"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
              )}

              <span>{item.label}</span>
            </>
          )

          return (
            <li
              key={item.id}
              className={classNames(
                'ui-breadcrumbs__item',
                isCurrent &&
                  'ui-breadcrumbs__item--current',
              )}
            >
              {index > 0 && (
                <span
                  className="ui-breadcrumbs__separator"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}

              {isCurrent ? (
                <span
                  className="ui-breadcrumbs__label"
                  aria-current="page"
                >
                  {content}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  variant="secondary"
                  underline="hover"
                >
                  <span className="ui-breadcrumbs__label">
                    {content}
                  </span>
                </Link>
              ) : (
                <span className="ui-breadcrumbs__label">
                  {content}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
