import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './Spinner.scss'

export type SpinnerSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

export type SpinnerVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'current'

export interface SpinnerProps
  extends Omit<
    ComponentPropsWithoutRef<'span'>,
    'children'
  > {
  size?: SpinnerSize
  variant?: SpinnerVariant
  label?: string
  showLabel?: boolean
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  label = 'Loading',
  showLabel = false,
  className,
  role = 'status',
  ...props
}: SpinnerProps) {
  return (
    <span
      {...props}
      role={role}
      className={classNames(
        'ui-spinner',
        `ui-spinner--${size}`,
        `ui-spinner--${variant}`,
        className,
      )}
    >
      <span
        className="ui-spinner__indicator"
        aria-hidden="true"
      />

      <span
        className={classNames(
          'ui-spinner__label',
          !showLabel && 'ui-spinner__label--hidden',
        )}
      >
        {label}
      </span>
    </span>
  )
}