import {
  useEffect,
  useId,
  useRef,
} from 'react'

import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { createPortal } from 'react-dom'

import { IconButton } from '../../Buttons'
import { classNames } from '../../../../Utils'

import './Modal.scss'

export type ModalSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full'

export interface ModalProps
  extends Omit<
    ComponentPropsWithoutRef<'dialog'>,
    'open' | 'onClose' | 'title' | 'children'
  > {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  showCloseButton?: boolean
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  closeLabel?: string
}

let scrollLockCount = 0
let previousOverflow = ''

function lockScroll() {
  if (scrollLockCount === 0) {
    previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'
  }

  scrollLockCount++

  return () => {
    scrollLockCount = Math.max(
      0,
      scrollLockCount - 1,
    )

    if (scrollLockCount === 0) {
      document.body.style.overflow =
        previousOverflow
    }
  }
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnBackdrop = true,
  closeLabel = 'Close dialog',
  className,
  onCancel,
  onClick,
  ...props
}: ModalProps) {
  const dialogRef =
    useRef<HTMLDialogElement>(null)

  const backdropPointerRef = useRef(false)

  const id = useId()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog || !open) {
      return
    }

    const previousFocus =
      document.activeElement

    if (!dialog.open) {
      dialog.showModal()
    }

    const unlock = lockScroll()

    return () => {
      if (dialog.open) {
        dialog.close()
      }

      unlock()

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus()
      }
    }
  }, [open])

  if (
    !open ||
    typeof document === 'undefined'
  ) {
    return null
  }

  const hasHeader =
    title != null ||
    description != null ||
    showCloseButton

  return createPortal(
    <dialog
      {...props}
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={
        props['aria-labelledby'] ??
        (
          title != null
            ? id + '-title'
            : undefined
        )
      }
      aria-describedby={
        props['aria-describedby'] ??
        (
          description != null
            ? id + '-description'
            : undefined
        )
      }
      className={classNames(
        'ui-modal',
        `ui-modal--${size}`,
        className,
      )}
      onCancel={event => {
        onCancel?.(event)

        if (event.defaultPrevented) {
          return
        }

        event.preventDefault()

        if (closeOnEscape) {
          onClose()
        }
      }}
      onPointerDown={event => {
        backdropPointerRef.current =
          event.target === event.currentTarget

        props.onPointerDown?.(event)
      }}
      onClick={event => {
        onClick?.(event)

        if (
          !event.defaultPrevented &&
          closeOnBackdrop &&
          backdropPointerRef.current &&
          event.target === event.currentTarget
        ) {
          onClose()
        }

        backdropPointerRef.current = false
      }}
    >
      <div className="ui-modal__panel">
        {hasHeader && (
          <header className="ui-modal__header">
            <div className="ui-modal__heading">
              {title != null && (
                <h2
                  id={id + '-title'}
                  className="ui-modal__title"
                >
                  {title}
                </h2>
              )}

              {description != null && (
                <div
                  id={id + '-description'}
                  className="ui-modal__description"
                >
                  {description}
                </div>
              )}
            </div>

            {showCloseButton && (
              <IconButton
                variant="ghost"
                size="sm"
                aria-label={closeLabel}
                onClick={onClose}
                className="ui-modal__close"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                }
              />
            )}
          </header>
        )}

        <div className="ui-modal__body">
          {children}
        </div>

        {footer != null && (
          <footer className="ui-modal__footer">
            {footer}
          </footer>
        )}
      </div>
    </dialog>,
    document.body,
  )
}
