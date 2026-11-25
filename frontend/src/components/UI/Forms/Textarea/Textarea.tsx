import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './Textarea.scss'

export interface TextareaProps
  extends ComponentPropsWithoutRef<'textarea'> {
  invalid?: boolean
}

export function Textarea({
  invalid,
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid ?? props['aria-invalid']}
      className={classNames('ui-textarea', className)}
    />
  )
}
