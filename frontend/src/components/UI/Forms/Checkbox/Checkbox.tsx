import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Checkbox.scss'

export interface CheckboxProps
  extends Omit<
    ComponentPropsWithoutRef<'input'>,
    'type' | 'children'
  > {
  label?: ReactNode
  wrapperClassName?: string
}

export function Checkbox({
  label,
  wrapperClassName,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={classNames(
        'ui-checkbox',
        wrapperClassName,
      )}
    >
      <input
        {...props}
        type="checkbox"
        className={classNames(
          'ui-checkbox__control',
          className,
        )}
      />

      {label != null && <span>{label}</span>}
    </label>
  )
}
