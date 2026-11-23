import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { classNames } from '../../../../utils/helpers/classNames'
import './ContentContainer.scss'
type ContentContainerProps<T extends ElementType = 'div'> = { as?: T; children: ReactNode; className?: string } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>
export function ContentContainer<T extends ElementType = 'div'>({ as, className, children, ...props }: ContentContainerProps<T>) {
  const Component = as ?? 'div'
  return <Component className={classNames('content-container', className)} {...props}>{children}</Component>
}
