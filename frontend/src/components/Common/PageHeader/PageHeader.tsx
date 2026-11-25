import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from '../../../Utils'
import { Heading } from '../../UI/Typography'

import './PageHeader.scss'

export interface PageHeaderProps extends ComponentPropsWithoutRef<'header'> {
  heading: ReactNode
  description?: ReactNode
}

export function PageHeader({
  heading, description, children, className, ...props
}: PageHeaderProps) {
  return (
    <header {...props} className={classNames('page-header', className)}>
      <Heading level={1}>{heading}</Heading>
      {description != null && <div className="page-header__description">{description}</div>}
      {children}
    </header>
  )
}
