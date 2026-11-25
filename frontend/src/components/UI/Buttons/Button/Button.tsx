import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from '../../../../Utils'

import './Button.scss'

export type ButtonVariant =
  | 'primary'
  | 'action'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'underline'
  | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      type = 'button',
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={classNames(
          'ui-button',
          `ui-button--${variant}`,
          `ui-button--${size}`,
          fullWidth && 'ui-button--full-width',
          loading && 'ui-button--loading',
          className,
        )}
      >
        {loading && (
          <span className="ui-button__spinner" aria-hidden="true" />
        )}

        <span className="ui-button__content">
          {leftIcon != null && (
            <span className="ui-button__icon" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          {children}

          {rightIcon != null && (
            <span className="ui-button__icon" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    )
  },
)
