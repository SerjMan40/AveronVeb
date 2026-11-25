import type {
  ComponentPropsWithoutRef,
  CSSProperties,
} from 'react'
import { classNames } from '../../../../Utils'

import './Skeleton.scss'

export type SkeletonVariant =
  | 'text'
  | 'rectangular'
  | 'rounded'
  | 'circular'

export type SkeletonAnimation =
  | 'pulse'
  | 'wave'
  | 'none'

export interface SkeletonProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children'
  > {
  variant?: SkeletonVariant
  animation?: SkeletonAnimation
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  count?: number
}

export function Skeleton({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  count = 1,
  className,
  style,
  ...props
}: SkeletonProps) {
  const safeCount = Number.isFinite(count)
    ? Math.max(1, Math.floor(count))
    : 1

  return (
    <div
      {...props}
      aria-hidden="true"
      className={classNames(
        'ui-skeleton',
        `ui-skeleton--${variant}`,
        `ui-skeleton--${animation}`,
        className,
      )}
      style={{
        ...style,
        ...(width !== undefined && { width }),
        ...(height !== undefined && safeCount === 1 && {
          height,
        }),
      }}
    >
      {Array.from({ length: safeCount }, (_, index) => (
        <div
          key={index}
          className="ui-skeleton__item"
          style={
            height !== undefined
              ? { height }
              : undefined
          }
        />
      ))}
    </div>
  )
}