import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import type {
  TextColor,
  TextWeight,
} from '../Text'

import { classNames } from '../../../../Utils'

import './Label.scss'

export type LabelSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'

export interface LabelProps
  extends ComponentPropsWithoutRef<'label'> {
  size?: LabelSize
  weight?: TextWeight
  color?: TextColor
  required?: boolean
  optional?: boolean
  optionalLabel?: string
  requiredMarker?: ReactNode
  disabled?: boolean
  error?: boolean
}

export function Label({
  size = 'sm',
  weight = 'medium',
  color = 'primary',
  required = false,
  optional = false,
  optionalLabel = 'Optional',
  requiredMarker = '*',
  disabled = false,
  error = false,
  className,
  children,
  ...props
}: LabelProps) {
  const resolvedColor =
    disabled
      ? 'muted'
      : error
        ? 'error'
        : color

  return (
    <label
      {...props}
      className={classNames(
        'ui-label',
        `ui-text--size-${size}`,
        `ui-text--weight-${weight}`,
        `ui-text--color-${resolvedColor}`,
        disabled && 'ui-label--disabled',
        className,
      )}
    >
      <span className="ui-label__content">
        {children}
      </span>

      {required && (
        <span
          className="ui-label__required"
          aria-hidden="true"
        >
          {requiredMarker}
        </span>
      )}

      {!required && optional && (
        <span className="ui-label__optional">
          ({optionalLabel})
        </span>
      )}
    </label>
  )
}
