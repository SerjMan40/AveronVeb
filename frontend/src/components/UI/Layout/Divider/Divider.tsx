import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Divider.scss'

export type DividerOrientation =
  | 'horizontal'
  | 'vertical'

export type DividerVariant =
  | 'solid'
  | 'dashed'
  | 'dotted'

export type DividerSpacing =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

export type DividerAlign =
  | 'start'
  | 'center'
  | 'end'

export interface DividerProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children'
  > {
  orientation?: DividerOrientation
  variant?: DividerVariant
  spacing?: DividerSpacing
  align?: DividerAlign
  label?: ReactNode
  decorative?: boolean
}

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  spacing = 'md',
  align = 'center',
  label,
  decorative = false,
  className,
  ...props
}: DividerProps) {
  const hasLabel =
    label != null && orientation === 'horizontal'

  return (
    <div
      {...props}
      role={decorative ? undefined : 'separator'}
      aria-orientation={
        decorative ? undefined : orientation
      }
      aria-hidden={decorative || undefined}
      className={classNames(
        'ui-divider',
        `ui-divider--${orientation}`,
        `ui-divider--${variant}`,
        `ui-divider--spacing-${spacing}`,
        `ui-divider--align-${align}`,
        hasLabel && 'ui-divider--labeled',
        className,
      )}
    >
      {hasLabel && (
        <span className="ui-divider__label">
          {label}
        </span>
      )}
    </div>
  )
}
