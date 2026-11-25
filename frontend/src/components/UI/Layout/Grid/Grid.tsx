import type {
  ComponentPropsWithoutRef,
  CSSProperties,
} from 'react'

import type { FlexGap } from '../Flex'

import { classNames } from '../../../../Utils'

import './Grid.scss'

export type GridElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'

export type GridGap = FlexGap

export type GridColumns = number | string

export type GridAlign =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'

export type GridAutoFlow =
  | 'row'
  | 'column'
  | 'row dense'
  | 'column dense'

export interface GridProps
  extends ComponentPropsWithoutRef<'div'> {
  as?: GridElement
  columns?: GridColumns
  rows?: GridColumns
  gap?: GridGap
  rowGap?: GridGap
  columnGap?: GridGap
  align?: GridAlign
  justify?: GridAlign
  autoFlow?: GridAutoFlow
  minColumnWidth?: CSSProperties['width']
  autoFit?: boolean
  inline?: boolean
  fullWidth?: boolean
}

function getGap(value: GridGap): string {
  return value === 'none'
    ? 'var(--space-0)'
    : `var(--space-${value})`
}

function getTemplate(value: GridColumns): string {
  if (typeof value === 'string') {
    return value
  }

  const count = Number.isFinite(value)
    ? Math.max(1, Math.floor(value))
    : 1

  return `repeat(${count}, minmax(0, 1fr))`
}

function getLength(
  value: CSSProperties['width'],
): string {
  return typeof value === 'number'
    ? `${value}px`
    : value ?? 'var(--container-width-sm)'
}

export function Grid({
  as: Component = 'div',
  columns = 1,
  rows,
  gap = 'md',
  rowGap,
  columnGap,
  align = 'stretch',
  justify = 'stretch',
  autoFlow = 'row',
  minColumnWidth,
  autoFit = true,
  inline = false,
  fullWidth = false,
  children,
  className,
  style,
  ...props
}: GridProps) {
  const templateColumns =
    minColumnWidth !== undefined
      ? `repeat(${autoFit ? 'auto-fit' : 'auto-fill'}, minmax(min(100%, ${getLength(minColumnWidth)}), 1fr))`
      : getTemplate(columns)

  return (
    <Component
      {...props}
      className={classNames(
        'ui-grid',
        inline && 'ui-grid--inline',
        fullWidth && 'ui-grid--full-width',
        className,
      )}
      style={{
        gridTemplateColumns: templateColumns,
        ...(rows !== undefined && {
          gridTemplateRows: getTemplate(rows),
        }),
        gridAutoFlow: autoFlow,
        alignItems: align,
        justifyItems: justify,
        gap: getGap(gap),
        ...(rowGap !== undefined && {
          rowGap: getGap(rowGap),
        }),
        ...(columnGap !== undefined && {
          columnGap: getGap(columnGap),
        }),
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
