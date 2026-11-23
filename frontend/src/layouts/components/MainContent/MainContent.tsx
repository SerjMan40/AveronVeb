import type { HTMLAttributes, PropsWithChildren } from 'react'
import { classNames } from '../../../utils/helpers/classNames'
import './MainContent.scss'
type MainContentProps = PropsWithChildren<HTMLAttributes<HTMLElement>>
export function MainContent({ className, children, ...props }: MainContentProps) {
  return <main className={classNames('main-content', className)} {...props}>{children}</main>
}
