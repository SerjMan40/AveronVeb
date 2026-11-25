import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './Input.scss'

export interface InputProps
  extends ComponentPropsWithoutRef<'input'> {
  invalid?: boolean
}

export function Input({
  invalid,
  className,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid ?? props['aria-invalid']}
      className={classNames('ui-input', className)}
    />
  )
}
