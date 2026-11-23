import type { PropsWithChildren } from 'react'
import { classNames } from '../../../../../utils/helpers/classNames'
import './MobileMenu.scss'
type MobileMenuProps = PropsWithChildren<{ isOpen: boolean }>
export function MobileMenu({ isOpen, children }: MobileMenuProps) {
  return <div className={classNames('mobile-menu', isOpen && 'mobile-menu--open')} aria-hidden={!isOpen} inert={!isOpen}>{children}</div>
}
