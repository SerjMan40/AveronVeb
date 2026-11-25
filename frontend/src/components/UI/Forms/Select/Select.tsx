import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './Select.scss'

export interface SelectProps
  extends ComponentPropsWithoutRef<'select'> {
  invalid?: boolean
}

export function Select({
  invalid,
  className,
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      aria-invalid={invalid ?? props['aria-invalid']}
      className={classNames('ui-select', className)}
    />
  )
}
