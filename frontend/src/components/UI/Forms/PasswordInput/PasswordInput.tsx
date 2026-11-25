import { useState } from 'react'

import { Input } from '../Input'
import type { InputProps } from '../Input'

import { classNames } from '../../../../Utils'

import './PasswordInput.scss'

export interface PasswordInputProps
  extends Omit<InputProps, 'type'> {
  showLabel?: string
  hideLabel?: string
  wrapperClassName?: string
}

export function PasswordInput({
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  wrapperClassName,
  disabled,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={classNames(
        'ui-password-input',
        wrapperClassName,
      )}
    >
      <Input
        {...props}
        disabled={disabled}
        type={visible ? 'text' : 'password'}
      />

      <button
        type="button"
        disabled={disabled}
        aria-label={visible ? hideLabel : showLabel}
        onClick={() => setVisible(v => !v)}
      >
        {visible ? hideLabel : showLabel}
      </button>
    </div>
  )
}
