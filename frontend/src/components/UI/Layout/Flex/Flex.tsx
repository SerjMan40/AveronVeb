import type {
  ComponentPropsWithoutRef,
  CSSProperties,
} from 'react'

import { classNames } from '../../../../Utils'

import './Flex.scss'

export type FlexElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'

export type FlexDirection =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse'

export type FlexAlign =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'
  | 'baseline'

export type FlexJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'

export type FlexWrap =
  | 'nowrap'
  | 'wrap'
  | 'wrap-reverse'

export type FlexGap =
  | 'none'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'

export interface FlexProps
  extends ComponentPropsWithoutRef<'div'> {
  as?: FlexElement
  direction?: FlexDirection
  align?: FlexAlign
  justify?: FlexJustify
  wrap?: FlexWrap
  gap?: FlexGap
  rowGap?: FlexGap
  columnGap?: FlexGap
  inline?: boolean
  fullWidth?: boolean
}

const alignValues: Record<
  FlexAlign,
  CSSProperties['alignItems']
> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const justifyValues: Record<
  FlexJustify,
  CSSProperties['justifyContent']
> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

function getGap(value: FlexGap): string {
  return value === 'none'
    ? 'var(--space-0)'
    : `var(--space-${value})`
}

export function Flex({
  as: Component = 'div',
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap',
  gap = 'md',
  rowGap,
  columnGap,
  inline = false,
  fullWidth = false,
  children,
  className,
  style,
  ...props
}: FlexProps) {
  return (
    <Component
      {...props}
      className={classNames(
        'ui-flex',
        inline && 'ui-flex--inline',
        fullWidth && 'ui-flex--full-width',
        className,
      )}
      style={{
        flexDirection: direction,
        alignItems: alignValues[align],
        justifyContent: justifyValues[justify],
        flexWrap: wrap,
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
