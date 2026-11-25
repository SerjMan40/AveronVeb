import type { ComponentPropsWithoutRef } from 'react'

import { classNames } from '../../../../Utils'

import './Container.scss'

export type ContainerElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'

export type ContainerSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'full'

export interface ContainerProps
  extends ComponentPropsWithoutRef<'div'> {
  as?: ContainerElement
  size?: ContainerSize
  centered?: boolean
  padded?: boolean
}

export function Container({
  as: Component = 'div',
  size = 'xl',
  centered = true,
  padded = true,
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      {...props}
      className={classNames(
        'ui-container',
        `ui-container--${size}`,
        centered && 'ui-container--centered',
        padded && 'ui-container--padded',
        className,
      )}
    >
      {children}
    </Component>
  )
}
