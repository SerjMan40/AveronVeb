import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Switch.scss'

export interface SwitchProps
  extends Omit<
    ComponentPropsWithoutRef<'input'>,
    'type' | 'children'
  > {
  label?: ReactNode
  wrapperClassName?: string
}

export function Switch({
  label,
  wrapperClassName,
  className,
  ...props
}: SwitchProps) {
  return (
    <label
      className={classNames(
        'ui-switch',
        wrapperClassName,
      )}
    >
      <input
        {...props}
        type="checkbox"
        role="switch"
        className={classNames(
          'ui-switch__control',
          className,
        )}
      />

      {label != null && <span>{label}</span>}
    </label>
  )
}
