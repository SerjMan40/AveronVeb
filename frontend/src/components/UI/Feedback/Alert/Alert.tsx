import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'
import { IconButton } from '../../Buttons'
import { classNames } from '../../../../Utils'

import './Alert.scss'

export type AlertVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'

export type AlertAppearance = 'soft' | 'outline'

export interface AlertProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  variant?: AlertVariant
  appearance?: AlertAppearance
  title?: ReactNode
  icon?: ReactNode
  hideIcon?: boolean
  onClose?: () => void
  closeLabel?: string
  actions?: ReactNode
}

const alertIcons: Record<AlertVariant, ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7h.01" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3 22 21H2L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6m0-6-6 6" />
    </>
  ),
}

export function Alert({
  variant = 'info',
  appearance = 'soft',
  title,
  icon,
  hideIcon = false,
  onClose,
  closeLabel = 'Close alert',
  actions,
  children,
  className,
  role,
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      role={role ?? (variant === 'error' ? 'alert' : 'status')}
      className={classNames(
        'ui-alert',
        `ui-alert--${variant}`,
        `ui-alert--${appearance}`,
        className,
      )}
    >
      {!hideIcon && (
        <span className="ui-alert__icon" aria-hidden="true">
          {icon ?? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {alertIcons[variant]}
            </svg>
          )}
        </span>
      )}

      <div className="ui-alert__content">
        {title != null && (
          <div className="ui-alert__title">
            {title}
          </div>
        )}

        {children != null && (
          <div className="ui-alert__description">
            {children}
          </div>
        )}

        {actions != null && (
          <div className="ui-alert__actions">
            {actions}
          </div>
        )}
      </div>

      {onClose && (
        <IconButton
          className="ui-alert__close"
          variant="ghost"
          size="sm"
          aria-label={closeLabel}
          onClick={onClose}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          }
        />
      )}
    </div>
  )
}