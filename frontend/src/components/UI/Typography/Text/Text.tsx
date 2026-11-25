import type {
  ComponentPropsWithoutRef,
} from 'react'

import { classNames } from '../../../../Utils'

import './Text.scss'

export type TextElement =
  | 'span'
  | 'div'
  | 'p'
  | 'small'
  | 'strong'
  | 'em'

export type TextSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | 'inherit'

export type TextWeight =
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'inherit'

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'inherit'

export type TextAlign =
  | 'start'
  | 'center'
  | 'end'
  | 'justify'

export type TextLineHeight =
  | 'tight'
  | 'heading'
  | 'base'
  | 'relaxed'
  | 'inherit'

export type TextTransform =
  | 'none'
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'

export interface TextProps
  extends ComponentPropsWithoutRef<'span'> {
  as?: TextElement
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
  align?: TextAlign
  lineHeight?: TextLineHeight
  transform?: TextTransform
  italic?: boolean
  underline?: boolean
  strikeThrough?: boolean
  truncate?: boolean
  lineClamp?: number
  noWrap?: boolean
  mono?: boolean
  tabular?: boolean
}

export function Text({
  as: Component = 'span',
  size = 'inherit',
  weight = 'inherit',
  color = 'inherit',
  align,
  lineHeight = 'inherit',
  transform = 'none',
  italic = false,
  underline = false,
  strikeThrough = false,
  truncate = false,
  lineClamp,
  noWrap = false,
  mono = false,
  tabular = false,
  className,
  style,
  children,
  ...props
}: TextProps) {
  const safeLineClamp =
    typeof lineClamp === 'number' &&
    Number.isFinite(lineClamp) &&
    lineClamp > 0
      ? Math.max(1, Math.floor(lineClamp))
      : undefined

  return (
    <Component
      {...props}
      className={classNames(
        'ui-text',
        `ui-text--size-${size}`,
        `ui-text--weight-${weight}`,
        `ui-text--color-${color}`,
        `ui-text--line-height-${lineHeight}`,
        `ui-text--transform-${transform}`,
        align && `ui-text--align-${align}`,
        italic && 'ui-text--italic',
        underline && 'ui-text--underline',
        strikeThrough && 'ui-text--strike-through',
        truncate && 'ui-text--truncate',
        !truncate &&
          safeLineClamp !== undefined &&
          'ui-text--clamp',
        noWrap &&
          !truncate &&
          safeLineClamp === undefined &&
          'ui-text--no-wrap',
        mono && 'ui-text--mono',
        tabular && 'ui-text--tabular',
        className,
      )}
      style={{
        ...style,
        ...(
          !truncate && safeLineClamp !== undefined
            ? { WebkitLineClamp: safeLineClamp }
            : {}
        ),
      }}
    >
      {children}
    </Component>
  )
}
