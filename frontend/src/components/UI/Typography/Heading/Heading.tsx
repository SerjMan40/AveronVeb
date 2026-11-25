import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { Text } from '../Text'
import type {
  TextAlign,
  TextColor,
  TextWeight,
} from '../Text'

import { classNames } from '../../../../Utils'

import './Heading.scss'

export type HeadingLevel =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6

export type HeadingElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'

export interface HeadingProps
  extends ComponentPropsWithoutRef<'h1'> {
  as?: HeadingElement
  level?: HeadingLevel
  weight?: TextWeight
  color?: TextColor
  align?: TextAlign
  balance?: boolean
  truncate?: boolean
  accent?: ReactNode
}

export function Heading({
  as,
  level = 2,
  weight = 'semibold',
  color = 'primary',
  align = 'start',
  balance = false,
  truncate = false,
  className,
  children,
  accent,
  ...props
}: HeadingProps) {
  const Component: HeadingElement =
    as ?? `h${level}`

  return (
    <Component
      {...props}
      className={classNames(
        'ui-heading',
        `ui-heading--level-${level}`,
        `ui-text--weight-${weight}`,
        `ui-text--color-${color}`,
        `ui-text--align-${align}`,
        balance &&
          !truncate &&
          'ui-heading--balance',
        truncate && 'ui-heading--truncate',
        className,
      )}
    >
      {children}
      {accent != null && <> <Text color="brand">{accent}</Text></>}
    </Component>
  )
}
