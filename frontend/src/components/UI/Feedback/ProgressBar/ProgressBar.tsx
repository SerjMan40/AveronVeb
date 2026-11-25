import { useId } from 'react'
import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'
import { classNames } from '../../../../Utils'

import './ProgressBar.scss'

export type ProgressBarVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type ProgressBarSize = 'sm' | 'md' | 'lg'

export interface ProgressBarProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children' | 'role'
  > {
  value?: number
  max?: number
  variant?: ProgressBarVariant
  size?: ProgressBarSize
  label?: ReactNode
  showValue?: boolean
  indeterminate?: boolean
  formatValue?: (
    value: number,
    max: number,
    percentage: number,
  ) => ReactNode
}

export function ProgressBar({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  label,
  showValue = false,
  indeterminate = false,
  formatValue,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ProgressBarProps) {
  const labelId = useId()

  const safeMax =
    Number.isFinite(max) && max > 0 ? max : 100

  const safeValue = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), safeMax)
    : 0

  const percentage = (safeValue / safeMax) * 100

  const hasLabel = label != null
  const hasValue = showValue && !indeterminate

  return (
    <div
      {...props}
      className={classNames(
        'ui-progress-bar',
        `ui-progress-bar--${variant}`,
        `ui-progress-bar--${size}`,
        indeterminate && 'ui-progress-bar--indeterminate',
        className,
      )}
    >
      {(hasLabel || hasValue) && (
        <div className="ui-progress-bar__header">
          {hasLabel && (
            <span
              id={labelId}
              className="ui-progress-bar__label"
            >
              {label}
            </span>
          )}

          {hasValue && (
            <span className="ui-progress-bar__value">
              {formatValue
                ? formatValue(
                    safeValue,
                    safeMax,
                    percentage,
                  )
                : `${Math.round(percentage)}%`}
            </span>
          )}
        </div>
      )}

      <div
        className="ui-progress-bar__track"
        role="progressbar"
        aria-label={
          ariaLabel ??
          (!hasLabel && !ariaLabelledBy
            ? 'Progress'
            : undefined)
        }
        aria-labelledby={
          ariaLabelledBy ??
          (!ariaLabel && hasLabel ? labelId : undefined)
        }
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={
          indeterminate ? undefined : safeValue
        }
      >
        <div
          className="ui-progress-bar__fill"
          style={
            indeterminate
              ? undefined
              : { width: `${percentage}%` }
          }
        />
      </div>
    </div>
  )
}