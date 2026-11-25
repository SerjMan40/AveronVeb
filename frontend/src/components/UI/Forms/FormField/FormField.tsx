import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './FormField.scss'

export interface FormFieldProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'title'
  > {
  label?: ReactNode
  htmlFor?: string
  description?: ReactNode
  error?: ReactNode
  required?: boolean
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div
      {...props}
      className={classNames(
        'ui-form-field',
        className,
      )}
    >
      {label != null && (
        <label
          htmlFor={htmlFor}
          className="ui-form-field__label"
        >
          {label}

          {required && (
            <span aria-hidden="true"> *</span>
          )}
        </label>
      )}

      {children}

      {description != null && (
        <div
          id={
            htmlFor
              ? `${htmlFor}-description`
              : undefined
          }
          className="ui-form-field__description"
        >
          {description}
        </div>
      )}

      {error != null && (
        <div
          id={
            htmlFor
              ? `${htmlFor}-error`
              : undefined
          }
          className="ui-form-field__error"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  )
}
