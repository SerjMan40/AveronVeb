import { classNames } from '../../../../Utils'
import { Link, type LinkProps } from '../Link'

import './SkipLink.scss'

export interface SkipLinkProps extends Omit<LinkProps, 'href'> {
  href: `#${string}`
}

export function SkipLink({ className, ...props }: SkipLinkProps) {
  return (
    <Link
      variant="inherit"
      underline="none"
      {...props}
      className={classNames('ui-skip-link', className)}
    />
  )
}
