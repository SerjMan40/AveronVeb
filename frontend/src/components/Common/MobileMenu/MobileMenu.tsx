import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../Utils'

import './MobileMenu.scss'

export interface MobileMenuProps extends ComponentPropsWithoutRef<'div'> {
  isOpen: boolean
}

export function MobileMenu({
  isOpen,
  children,
  className,
  ...props
}: MobileMenuProps) {
  return (
    <div
      {...props}
      className={classNames(
        'mobile-menu',
        isOpen && 'mobile-menu--open',
        className,
      )}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      {children}
    </div>
  )
}