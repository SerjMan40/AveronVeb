import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Popover.scss'

export type PopoverPlacement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'

export type PopoverAlign =
  | 'start'
  | 'center'
  | 'end'

export interface PopoverProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children'
  > {
  trigger: ReactNode
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: PopoverPlacement
  align?: PopoverAlign
  appearance?: 'default' | 'accent'
  disabled?: boolean
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
  triggerLabel?: string
  contentClassName?: string
  contentRole?: 'dialog' | 'menu' | 'group'
  contentLabel?: string
}

export function Popover({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  align = 'start',
  appearance = 'default',
  disabled = false,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  triggerLabel,
  contentClassName,
  contentRole = 'group',
  contentLabel,
  className,
  ...props
}: PopoverProps) {
  const id = useId()

  const rootRef = useRef<HTMLDivElement>(null)

  const triggerRef =
    useRef<HTMLButtonElement>(null)

  const [internalOpen, setInternalOpen] =
    useState(defaultOpen)

  const controlled = open !== undefined

  const isOpen =
    !disabled &&
    (controlled ? open : internalOpen)

  function changeOpen(next: boolean) {
    if (!controlled) {
      setInternalOpen(next)
    }

    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(
      event: PointerEvent,
    ) {
      if (
        closeOnOutsideClick &&
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        if (!controlled) {
          setInternalOpen(false)
        }

        onOpenChange?.(false)
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === 'Escape' &&
        closeOnEscape &&
        !event.defaultPrevented
      ) {
        event.preventDefault()

        if (!controlled) {
          setInternalOpen(false)
        }

        onOpenChange?.(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    )

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      )

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    isOpen,
    controlled,
    closeOnOutsideClick,
    closeOnEscape,
    onOpenChange,
  ])

  return (
    <div
      {...props}
      ref={rootRef}
      className={classNames(
        'ui-popover',
        `ui-popover--${placement}`,
        `ui-popover--align-${align}`,
        appearance === 'accent' && 'ui-popover--accent',
        isOpen && 'ui-popover--open',
        className,
      )}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        aria-controls={
          isOpen ? id : undefined
        }
        aria-haspopup={
          contentRole === 'group'
            ? undefined
            : contentRole
        }
        className="ui-popover__trigger"
        onClick={() => changeOpen(!isOpen)}
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          id={id}
          role={contentRole}
          aria-label={contentLabel}
          className={classNames(
            'ui-popover__content',
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
