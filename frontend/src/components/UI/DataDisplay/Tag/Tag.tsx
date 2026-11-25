import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'
import { classNames } from '../../../../Utils'

import './Tag.scss'

export type TagVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type TagAppearance = 'soft' | 'outline'

export type TagSize = 'sm' | 'md' | 'lg'

export interface TagProps
  extends ComponentPropsWithoutRef<'span'> {
  variant?: TagVariant
  appearance?: TagAppearance
  size?: TagSize
  rounded?: boolean
  icon?: ReactNode
  onRemove?: () => void
  removeLabel?: string
  disabled?: boolean
}

export function Tag({
  variant = 'default',
  appearance = 'soft',
  size = 'md',
  rounded = false,
  icon,
  onRemove,
  removeLabel = 'Remove tag',
  disabled = false,
  children,
  className,
  ...props
}: TagProps) {
  return (
    <span
      {...props}
      className={classNames(
        'ui-tag',
        `ui-tag--${variant}`,
        `ui-tag--${appearance}`,
        `ui-tag--${size}`,
        rounded && 'ui-tag--rounded',
        disabled && 'ui-tag--disabled',
        className,
      )}
    >
      {icon != null && (
        <span
          className="ui-tag__icon"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <span className="ui-tag__label">
        {children}
      </span>

      {onRemove && (
        <button
          type="button"
          className="ui-tag__remove"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </span>
  )
}