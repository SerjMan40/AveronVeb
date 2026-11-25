import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../Utils'

import './Section.scss'

export type SectionProps = ComponentPropsWithoutRef<'section'>

export function Section({
  className, ...props
}: SectionProps) {
  return (
    <section {...props} className={classNames('common-section', className)} />
  )
}
