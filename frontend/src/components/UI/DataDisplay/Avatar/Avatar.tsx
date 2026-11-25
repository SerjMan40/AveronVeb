import { useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from '../../../../Utils'

import './Avatar.scss'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type AvatarShape = 'circle' | 'rounded' | 'square'

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  src?: string
  name?: string
  alt?: string
  size?: AvatarSize
  shape?: AvatarShape
  fallback?: ReactNode
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toUpperCase()
}

export function Avatar({
  src,
  name,
  alt,
  size = 'md',
  shape = 'circle',
  fallback,
  className,
  ...props
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>()

  const showImage = Boolean(src && failedSrc !== src)
  const initials = name ? getInitials(name) : ''
  const accessibleName = alt ?? name ?? ''

  return (
    <span
      {...props}
      role={accessibleName ? 'img' : undefined}
      aria-label={accessibleName || undefined}
      aria-hidden={!accessibleName || undefined}
      className={classNames(
        'ui-avatar',
        `ui-avatar--${size}`,
        `ui-avatar--${shape}`,
        className,
      )}
    >
      {showImage ? (
        <img
          className="ui-avatar__image"
          src={src}
          alt=""
          draggable={false}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span className="ui-avatar__fallback" aria-hidden="true">
          {fallback ?? (
            initials || (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
            )
          )}
        </span>
      )}
    </span>
  )
}