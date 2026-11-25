import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Icon.scss'

export type IconSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'inherit'

export type IconVariant =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export interface IconProps
  extends Omit<
    ComponentPropsWithoutRef<'span'>,
    'children'
  > {
  children: ReactNode
  size?: IconSize
  variant?: IconVariant
  label?: string
  spin?: boolean
}

export function Icon({
  children,
  size = 'md',
  variant = 'current',
  label,
  spin = false,
  className,
  ...props
}: IconProps) {
  return (
    <span
      {...props}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={classNames(
        'ui-icon',
        `ui-icon--${size}`,
        `ui-icon--${variant}`,
        spin && 'ui-icon--spin',
        className,
      )}
    >
      {children}
    </span>
  )
}
