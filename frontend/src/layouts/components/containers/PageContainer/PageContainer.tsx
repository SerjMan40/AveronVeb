import type { ComponentPropsWithoutRef } from 'react'
import { Stack } from '../../../../components/UI'
import { classNames } from '../../../../Utils'

import './PageContainer.scss'

export interface PageContainerProps
  extends ComponentPropsWithoutRef<'div'> {}

export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <Stack
      {...props}
      gap="none"
      fullWidth
      className={classNames(
        'page-container',
        className,
      )}
    >
      {children}
    </Stack>
  )
}
