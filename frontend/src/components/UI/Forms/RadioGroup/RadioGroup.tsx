import { useId } from 'react'

import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { Radio } from '../Radio'
import { classNames } from '../../../../Utils'

import './RadioGroup.scss'

export interface RadioGroupOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps
  extends Omit<
    ComponentPropsWithoutRef<'fieldset'>,
    'children' | 'onChange' | 'defaultValue'
  > {
  options: readonly RadioGroupOption[]
  name?: string
  legend?: ReactNode
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  required?: boolean
}

export function RadioGroup({
  options,
  name,
  legend,
  value,
  defaultValue,
  onChange,
  orientation = 'vertical',
  required,
  disabled,
  className,
  ...props
}: RadioGroupProps) {
  const id = useId()

  return (
    <fieldset
      {...props}
      disabled={disabled}
      className={classNames(
        'ui-radio-group',
        className,
      )}
    >
      {legend != null && (
        <legend>{legend}</legend>
      )}

      <div
        className={classNames(
          'ui-radio-group__items',
          `ui-radio-group__items--${orientation}`,
        )}
      >
        {options.map(option => (
          <Radio
            key={option.value}
            name={name ?? id}
            value={option.value}
            label={option.label}
            disabled={option.disabled}
            required={required}
            checked={
              value === undefined
                ? undefined
                : value === option.value
            }
            defaultChecked={
              value === undefined
                ? defaultValue === option.value
                : undefined
            }
            onChange={() => onChange?.(option.value)}
          />
        ))}
      </div>
    </fieldset>
  )
}
