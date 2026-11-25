import { Input } from '../Input'
import type { InputProps } from '../Input'

import { classNames } from '../../../../Utils'

import './SearchInput.scss'

export interface SearchInputProps
  extends Omit<InputProps, 'type'> {
  onClear?: () => void
  clearLabel?: string
  wrapperClassName?: string
}

export function SearchInput({
  onClear,
  clearLabel = 'Clear search',
  wrapperClassName,
  disabled,
  ...props
}: SearchInputProps) {
  return (
    <div
      className={classNames(
        'ui-search-input',
        wrapperClassName,
      )}
    >
      <Input
        {...props}
        disabled={disabled}
        type="search"
      />

      {onClear && (
        <button
          type="button"
          disabled={disabled}
          aria-label={clearLabel}
          onClick={onClear}
        >
          ×
        </button>
      )}
    </div>
  )
}
