import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../Utils'
import { Link } from '../../UI/Navigation/Link'

import './Logo.scss'

export interface LogoProps
  extends ComponentPropsWithoutRef<'a'> {
  name: string
  src?: string
  showName?: boolean
  smoothScroll?: boolean
}

export function Logo({
  name,
  src,
  showName = true,
  smoothScroll = false,
  href = '/',
  className,
  ...props
}: LogoProps) {
  return (
    <Link
      {...props}
      href={href}
      state={smoothScroll ? { smoothScroll: true } : undefined}
      variant="inherit"
      underline="none"
      aria-label={name}
      className={classNames('logo', className)}
    >
      {src && (
        <img
          className="logo__image"
          src={src}
          alt=""
        />
      )}

      {(showName || !src) && (
        <span className="logo__name">{name}</span>
      )}
    </Link>
  )
}
