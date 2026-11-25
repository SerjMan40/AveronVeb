import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'
import { classNames } from '../../../../Utils'

import './EmptyState.scss'

export type EmptyStateSize = 'sm' | 'md' | 'lg'

export interface EmptyStateProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  hideIcon?: boolean
  actions?: ReactNode
  size?: EmptyStateSize
}

export function EmptyState({
  title,
  description,
  icon,
  hideIcon = false,
  actions,
  size = 'md',
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      {...props}
      className={classNames(
        'ui-empty-state',
        `ui-empty-state--${size}`,
        className,
      )}
    >
      {!hideIcon && (
        <div
          className="ui-empty-state__icon"
          aria-hidden="true"
        >
          {icon ?? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16l2 10v6H2v-6L4 4Z" />
              <path d="M2 14h6l2 3h4l2-3h6" />
            </svg>
          )}
        </div>
      )}

      <div className="ui-empty-state__content">
        <div className="ui-empty-state__title">
          {title}
        </div>

        {description != null && (
          <div className="ui-empty-state__description">
            {description}
          </div>
        )}

        {children}
      </div>

      {actions != null && (
        <div className="ui-empty-state__actions">
          {actions}
        </div>
      )}
    </div>
  )
}