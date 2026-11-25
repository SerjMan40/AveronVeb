import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './CodeMarquee.scss'

export interface CodeMarqueeProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  code: string
  orientation?: 'horizontal' | 'vertical'
  continuous?: boolean
}

export function CodeMarquee({
  code, orientation = 'horizontal', continuous = false, className, ...props
}: CodeMarqueeProps) {
  return (
    <div
      {...props}
      className={classNames(
        'ui-code-marquee',
        `ui-code-marquee--${orientation}`,
        continuous && 'ui-code-marquee--continuous',
        className,
      )}
      aria-hidden="true"
    >
      <div className="ui-code-marquee__track">
        <code>{code}</code>
        <code>{code}</code>
      </div>
    </div>
  )
}
