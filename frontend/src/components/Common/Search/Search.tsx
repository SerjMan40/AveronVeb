import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../Utils'
import { Button } from '../../UI/Buttons'
import { SearchInput } from '../../UI/Forms'

import './Search.scss'

export interface SearchProps extends Omit<ComponentPropsWithoutRef<'form'>, 'children'> {
  inputLabel?: string
  submitLabel?: string
  queryName?: string
  defaultQuery?: string
}

export function Search({
  inputLabel = 'Search',
  submitLabel = 'Search',
  queryName = 'q',
  defaultQuery,
  className,
  ...props
}: SearchProps) {
  return (
    <form {...props} role="search" className={classNames('site-search', className)}>
      <SearchInput
        wrapperClassName="site-search__input"
        name={queryName}
        defaultValue={defaultQuery}
        aria-label={inputLabel}
      />
      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
