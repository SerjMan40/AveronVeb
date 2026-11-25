import type { ComponentPropsWithoutRef } from 'react'

import { classNames } from '../../../../Utils'

import './Spacer.scss'

export type SpacerSize =
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

export type SpacerOrientation =
  | 'horizontal'
  | 'vertical'

export interface SpacerProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children'
  > {
  size?: SpacerSize
  orientation?: SpacerOrientation
  grow?: boolean
}

export function Spacer({
  size = 'md',
  orientation = 'vertical',
  grow = false,
  className,
  ...props
}: SpacerProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={classNames(
        'ui-spacer',
        `ui-spacer--${orientation}`,
        `ui-spacer--${size}`,
        grow && 'ui-spacer--grow',
        className,
      )}
    />
  )
}
