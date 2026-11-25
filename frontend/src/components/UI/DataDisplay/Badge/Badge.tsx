import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from '../../../../Utils'

import './Badge.scss'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type BadgeAppearance = 'solid' | 'soft' | 'outline'

export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  variant?: BadgeVariant
  appearance?: BadgeAppearance
  size?: BadgeSize
  rounded?: boolean
  dot?: boolean
  icon?: ReactNode
}

export function Badge({
  variant = 'default',
  appearance = 'soft',
  size = 'md',
  rounded = false,
  dot = false,
  icon,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={classNames(
        'ui-badge',
        `ui-badge--${variant}`,
        `ui-badge--${appearance}`,
        `ui-badge--${size}`,
        rounded && 'ui-badge--rounded',
        className,
      )}
    >
      {dot && (
        <span className="ui-badge__dot" aria-hidden="true" />
      )}

      {icon != null && (
        <span className="ui-badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}

      {children}
    </span>
  )
}