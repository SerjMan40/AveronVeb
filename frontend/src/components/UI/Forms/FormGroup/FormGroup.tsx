import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './FormGroup.scss'

export interface FormGroupProps
  extends ComponentPropsWithoutRef<'fieldset'> {
  legend?: ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export function FormGroup({
  legend,
  orientation = 'vertical',
  children,
  className,
  ...props
}: FormGroupProps) {
  return (
    <fieldset
      {...props}
      className={classNames(
        'ui-form-group',
        className,
      )}
    >
      {legend != null && (
        <legend>{legend}</legend>
      )}

      <div
        className={classNames(
          'ui-form-group__content',
          `ui-form-group__content--${orientation}`,
        )}
      >
        {children}
      </div>
    </fieldset>
  )
}
