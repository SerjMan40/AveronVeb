import type {
  ComponentPropsWithoutRef,
  Key,
  ReactNode,
} from 'react'
import { classNames } from '../../../../Utils'

import './List.scss'

export type ListVariant = 'default' | 'divided' | 'bordered'

export type ListSize = 'sm' | 'md' | 'lg'

export type ListMarker = 'none' | 'disc' | 'decimal'

export interface ListProps<T>
  extends Omit<ComponentPropsWithoutRef<'ul'>, 'children'> {
  items: readonly T[]
  renderItem: (item: T, index: number) => ReactNode
  getKey: (item: T, index: number) => Key
  variant?: ListVariant
  size?: ListSize
  marker?: ListMarker
  emptyContent?: ReactNode
}

export function List<T>({
  items,
  renderItem,
  getKey,
  variant = 'default',
  size = 'md',
  marker = 'none',
  emptyContent,
  className,
  ...props
}: ListProps<T>) {
  const Component = marker === 'decimal' ? 'ol' : 'ul'

  return (
    <Component
      {...props}
      role="list"
      className={classNames(
        'ui-list',
        `ui-list--${variant}`,
        `ui-list--${size}`,
        `ui-list--marker-${marker}`,
        className,
      )}
    >
      {items.length > 0
        ? items.map((item, index) => (
            <li
              key={getKey(item, index)}
              className="ui-list__item"
            >
              {renderItem(item, index)}
            </li>
          ))
        : emptyContent != null && (
            <li className="ui-list__empty">
              {emptyContent}
            </li>
          )}
    </Component>
  )
}