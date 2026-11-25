import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './BorderWink.scss'

export type BorderWinkProps = ComponentPropsWithoutRef<'span'>

export function BorderWink({ className, ...props }: BorderWinkProps) {
  return <span {...props} className={classNames('ui-border-wink', className)} />
}
