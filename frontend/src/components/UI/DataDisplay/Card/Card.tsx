import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from '../../../../Utils'

import './Card.scss'

export type CardElement = 'div' | 'article' | 'section'

export type CardVariant =
  | 'outline'
  | 'filled'
  | 'elevated'
  | 'plain'

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  as?: CardElement
  variant?: CardVariant
  padding?: CardPadding
  hoverable?: boolean
  media?: ReactNode
  mediaPlacement?: 'top' | 'background'
  header?: ReactNode
  footer?: ReactNode
}

export function Card({
  as: Component = 'div',
  variant = 'outline',
  padding = 'md',
  hoverable = false,
  media,
  mediaPlacement = 'top',
  header,
  footer,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <Component
      {...props}
      className={classNames(
        'ui-card',
        `ui-card--${variant}`,
        `ui-card--padding-${padding}`,
        hoverable && 'ui-card--hoverable',
        media != null && mediaPlacement === 'background' && 'ui-card--media-background',
        className,
      )}
    >
      {media != null && (
        <div className="ui-card__media">{media}</div>
      )}

      {header != null && (
        <div className="ui-card__header">{header}</div>
      )}

      {children != null && (
        <div className="ui-card__body">{children}</div>
      )}

      {footer != null && (
        <div className="ui-card__footer">{footer}</div>
      )}
    </Component>
  )
}
