import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import type { ButtonProps } from '../Button'
import { classNames } from '../../../../Utils'

import './IconButton.scss'

export interface IconButtonProps
  extends Omit<
    ButtonProps,
    'children' | 'leftIcon' | 'rightIcon' | 'fullWidth' | 'aria-label'
  > {
  icon: ReactNode
  'aria-label': string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      variant = 'ghost',
      className,
      ...props
    },
    ref,
  ) {
    return (
      <Button
        {...props}
        ref={ref}
        variant={variant}
        className={classNames('ui-icon-button', className)}
      >
        <span aria-hidden="true">{icon}</span>
      </Button>
    )
  },
)