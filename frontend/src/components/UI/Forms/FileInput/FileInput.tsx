import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './FileInput.scss'

export type FileInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'value' | 'defaultValue' | 'children'
>

export function FileInput({
  className,
  ...props
}: FileInputProps) {
  return (
    <input
      {...props}
      type="file"
      className={classNames(
        'ui-file-input',
        className,
      )}
    />
  )
}
