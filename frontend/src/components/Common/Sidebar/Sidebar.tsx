import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../Utils'

import './Sidebar.scss'

export type SidebarProps = ComponentPropsWithoutRef<'aside'>

export function Sidebar({
  className, ...props
}: SidebarProps) {
  return (
    <aside {...props} className={classNames('sidebar', className)} />
  )
}
