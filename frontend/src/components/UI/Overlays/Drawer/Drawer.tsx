import { Modal } from '../Modal'
import type { ModalProps } from '../Modal'

import { classNames } from '../../../../Utils'

import './Drawer.scss'

export type DrawerPlacement =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'

export type DrawerSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'full'

export interface DrawerProps
  extends Omit<ModalProps, 'size'> {
  placement?: DrawerPlacement
  size?: DrawerSize
}

export function Drawer({
  placement = 'right',
  size = 'md',
  className,
  ...props
}: DrawerProps) {
  return (
    <Modal
      {...props}
      size="full"
      className={classNames(
        'ui-drawer',
        `ui-drawer--${placement}`,
        `ui-drawer--${size}`,
        className,
      )}
    />
  )
}
