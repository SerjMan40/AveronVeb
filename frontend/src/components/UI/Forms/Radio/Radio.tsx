import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Radio.scss'

export interface RadioProps
  extends Omit<
    ComponentPropsWithoutRef<'input'>,
    'type' | 'children'
  > {
  label?: ReactNode
  wrapperClassName?: string
}

export function Radio({
  label,
  wrapperClassName,
  className,
  ...props
}: RadioProps) {
  return (
    <label
      className={classNames(
        'ui-radio',
        wrapperClassName,
      )}
    >
      <input
        {...props}
        type="radio"
        className={classNames(
          'ui-radio__control',
          className,
        )}
      />

      {label != null && <span>{label}</span>}
    </label>
  )
}
