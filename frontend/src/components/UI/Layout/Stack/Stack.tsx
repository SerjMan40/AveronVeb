import type {
  ComponentPropsWithoutRef,
  CSSProperties,
} from 'react'

import { Children, Fragment } from 'react'

import { Flex } from '../Flex'

import type {
  FlexProps,
  FlexGap,
  FlexAlign,
  FlexJustify,
  FlexElement,
} from '../Flex'

import { Divider } from '../Divider'
import { classNames } from '../../../../Utils'

import './Stack.scss'

export type StackDirection =
  | 'horizontal'
  | 'vertical'

export type StackGap = FlexGap

export type StackAlign = FlexAlign

export type StackJustify = FlexJustify

export interface StackProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children'
  > {
  as?: FlexElement
  direction?: StackDirection
  gap?: StackGap
  align?: StackAlign
  justify?: StackJustify
  reverse?: boolean
  wrap?: boolean
  divided?: boolean
  fullWidth?: boolean
  children?: FlexProps['children']
}

export function Stack({
  as = 'div',
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  reverse = false,
  wrap = false,
  divided = false,
  fullWidth = false,
  children,
  className,
  style,
  ...props
}: StackProps) {
  const horizontal = direction === 'horizontal'

  const flexDirection: FlexProps['direction'] =
    horizontal
      ? reverse
        ? 'row-reverse'
        : 'row'
      : reverse
        ? 'column-reverse'
        : 'column'

  const items = Children.toArray(children)

  const stackStyle: CSSProperties = {
    ...style,
  }

  return (
    <Flex
      {...props}
      as={as}
      direction={flexDirection}
      align={align}
      justify={justify}
      gap={gap}
      wrap={wrap ? 'wrap' : 'nowrap'}
      fullWidth={fullWidth}
      className={classNames(
        'ui-stack',
        `ui-stack--${direction}`,
        className,
      )}
      style={stackStyle}
    >
      {divided
        ? items.map((child, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <Divider
                  orientation={
                    horizontal
                      ? 'vertical'
                      : 'horizontal'
                  }
                  spacing="none"
                  decorative
                />
              )}

              {child}
            </Fragment>
          ))
        : children}
    </Flex>
  )
}
