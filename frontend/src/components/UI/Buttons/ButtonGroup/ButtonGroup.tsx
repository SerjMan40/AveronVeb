import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './ButtonGroup.scss'

export interface ButtonGroupProps
  extends ComponentPropsWithoutRef<'div'> {
  orientation?: 'horizontal' | 'vertical'
  attached?: boolean
  fullWidth?: boolean
}

export function ButtonGroup({
  orientation = 'horizontal',
  attached = false,
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      className={classNames(
        'ui-button-group',
        `ui-button-group--${orientation}`,
        attached && 'ui-button-group--attached',
        fullWidth && 'ui-button-group--full-width',
        className,
      )}
    >
      {children}
    </div>
  )
}