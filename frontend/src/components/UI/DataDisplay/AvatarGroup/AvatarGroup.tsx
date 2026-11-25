import type { ComponentPropsWithoutRef } from 'react'
import { Avatar } from '../Avatar'
import type { AvatarProps, AvatarSize, AvatarShape } from '../Avatar'
import { classNames } from '../../../../Utils'

import './AvatarGroup.scss'

export interface AvatarGroupItem
  extends Omit<AvatarProps, 'size' | 'shape'> {
  id: string
}

export interface AvatarGroupProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  items: readonly AvatarGroupItem[]
  max?: number
  size?: AvatarSize
  shape?: AvatarShape
  overlap?: boolean
  overflowLabel?: (count: number) => string
}

export function AvatarGroup({
  items,
  max = 5,
  size = 'md',
  shape = 'circle',
  overlap = true,
  overflowLabel = (count) => `+${count}`,
  className,
  ...props
}: AvatarGroupProps) {
  const limit = Number.isFinite(max)
    ? Math.max(0, Math.floor(max))
    : items.length

  const visibleItems = items.slice(0, limit)
  const remaining = items.length - visibleItems.length

  return (
    <div
      {...props}
      role="group"
      className={classNames(
        'ui-avatar-group',
        overlap && 'ui-avatar-group--overlap',
        className,
      )}
    >
      {visibleItems.map(({ id, ...item }) => (
        <Avatar
          {...item}
          key={id}
          size={size}
          shape={shape}
        />
      ))}

      {remaining > 0 && (
        <Avatar
          size={size}
          shape={shape}
          alt={overflowLabel(remaining)}
          fallback={`+${remaining}`}
          className="ui-avatar-group__overflow"
        />
      )}
    </div>
  )
}