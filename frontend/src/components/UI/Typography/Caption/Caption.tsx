import type {
  ComponentPropsWithoutRef,
} from 'react'

import type {
  TextAlign,
  TextColor,
  TextWeight,
} from '../Text'

import { classNames } from '../../../../Utils'

import './Caption.scss'

export type CaptionElement =
  | 'span'
  | 'small'
  | 'p'
  | 'div'
  | 'figcaption'

export type CaptionSize =
  | 'xs'
  | 'sm'

export interface CaptionProps
  extends ComponentPropsWithoutRef<'span'> {
  as?: CaptionElement
  size?: CaptionSize
  weight?: TextWeight
  color?: TextColor
  align?: TextAlign
  italic?: boolean
  truncate?: boolean
}

export function Caption({
  as: Component = 'small',
  size = 'xs',
  weight = 'regular',
  color = 'muted',
  align = 'start',
  italic = false,
  truncate = false,
  className,
  children,
  ...props
}: CaptionProps) {
  return (
    <Component
      {...props}
      className={classNames(
        'ui-caption',
        `ui-text--size-${size}`,
        `ui-text--weight-${weight}`,
        `ui-text--color-${color}`,
        `ui-text--align-${align}`,
        italic && 'ui-text--italic',
        truncate && 'ui-caption--truncate',
        className,
      )}
    >
      {children}
    </Component>
  )
}
