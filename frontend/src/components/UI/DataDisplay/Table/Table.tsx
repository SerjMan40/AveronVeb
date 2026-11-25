import type {
  ComponentPropsWithoutRef,
  Key,
  ReactNode,
} from 'react'
import { classNames } from '../../../../Utils'

import './Table.scss'

export type TableSize = 'sm' | 'md' | 'lg'

export type TableAlign = 'start' | 'center' | 'end'

export interface TableColumn<T> {
  id: string
  header: ReactNode
  render: (row: T, index: number) => ReactNode
  align?: TableAlign
  width?: string | number
}

export interface TableProps<T>
  extends Omit<
    ComponentPropsWithoutRef<'table'>,
    'children'
  > {
  data: readonly T[]
  columns: readonly TableColumn<T>[]
  getRowKey: (row: T, index: number) => Key
  size?: TableSize
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  stickyHeader?: boolean
  emptyContent?: ReactNode
  caption?: ReactNode
  wrapperClassName?: string
}

export function Table<T>({
  data,
  columns,
  getRowKey,
  size = 'md',
  striped = false,
  bordered = false,
  hoverable = false,
  stickyHeader = false,
  emptyContent,
  caption,
  wrapperClassName,
  className,
  ...props
}: TableProps<T>) {
  return (
    <div
      className={classNames(
        'ui-table-wrapper',
        bordered && 'ui-table-wrapper--bordered',
        wrapperClassName,
      )}
    >
      <table
        {...props}
        className={classNames(
          'ui-table',
          `ui-table--${size}`,
          striped && 'ui-table--striped',
          hoverable && 'ui-table--hoverable',
          stickyHeader && 'ui-table--sticky-header',
          className,
        )}
      >
        {caption != null && (
          <caption className="ui-table__caption">
            {caption}
          </caption>
        )}

        <thead className="ui-table__head">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                style={{ width: column.width }}
                className={classNames(
                  'ui-table__cell',
                  `ui-table__cell--${column.align ?? 'start'}`,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="ui-table__body">
          {data.length > 0
            ? data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className="ui-table__row"
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={classNames(
                        'ui-table__cell',
                        `ui-table__cell--${column.align ?? 'start'}`,
                      )}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              ))
            : emptyContent != null && (
                <tr>
                  <td
                    colSpan={Math.max(columns.length, 1)}
                    className="ui-table__empty"
                  >
                    {emptyContent}
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  )
}