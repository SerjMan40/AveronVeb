import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from '../../../Utils'

import './PageLayout.scss'

export interface PageLayoutProps extends ComponentPropsWithoutRef<'div'> {
  sidebar?: ReactNode
}

export function PageLayout({
  sidebar, children, className, ...props
}: PageLayoutProps) {
  return (
    <div {...props} className={classNames('page-layout', className)}>
      {sidebar}
      <div className="page-layout__content">{children}</div>
    </div>
  )
}
