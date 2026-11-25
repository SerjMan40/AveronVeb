import type { ReactNode } from 'react'

import { Modal } from '../Modal'
import type { ModalProps } from '../Modal'

import { Button } from '../../Buttons'
import { classNames } from '../../../../Utils'

import './ConfirmDialog.scss'

export type ConfirmDialogVariant =
  | 'default'
  | 'danger'

export interface ConfirmDialogProps
  extends Omit<
    ModalProps,
    'footer' | 'children' | 'title'
  > {
  title: ReactNode
  children?: ReactNode
  icon?: ReactNode
  variant?: ConfirmDialogVariant
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  confirmDisabled?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  title,
  children,
  icon,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  confirmDisabled = false,
  onConfirm,
  onClose,
  size = 'sm',
  closeOnEscape = true,
  closeOnBackdrop = false,
  showCloseButton = false,
  className,
  ...props
}: ConfirmDialogProps) {
  function handleClose() {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Modal
      {...props}
      role="alertdialog"
      title={title}
      size={size}
      onClose={handleClose}
      closeOnEscape={
        closeOnEscape && !loading
      }
      closeOnBackdrop={
        closeOnBackdrop && !loading
      }
      showCloseButton={
        showCloseButton && !loading
      }
      className={classNames(
        'ui-confirm-dialog',
        `ui-confirm-dialog--${variant}`,
        className,
      )}
      footer={
        <>
          <Button
            variant="outline"
            disabled={loading}
            autoFocus
            onClick={handleClose}
          >
            {cancelLabel}
          </Button>

          <Button
            variant={
              variant === 'danger'
                ? 'danger'
                : 'primary'
            }
            loading={loading}
            disabled={confirmDisabled}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="ui-confirm-dialog__content">
        {icon != null && (
          <span
            className="ui-confirm-dialog__icon"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {children != null && (
          <div className="ui-confirm-dialog__message">
            {children}
          </div>
        )}
      </div>
    </Modal>
  )
}
