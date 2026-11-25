import {
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
  KeyboardEvent,
  ReactNode,
} from 'react'

import { Popover } from '../Popover'
import type { PopoverProps } from '../Popover'

import { classNames } from '../../../../Utils'

import './Dropdown.scss'

export interface DropdownAction {
  type?: 'item'
  id: string
  label: ReactNode
  icon?: ReactNode
  description?: ReactNode
  disabled?: boolean
  danger?: boolean
  onSelect?: () => void
}

export interface DropdownSeparator {
  type: 'separator'
  id: string
}

export type DropdownItem =
  | DropdownAction
  | DropdownSeparator

export interface DropdownProps
  extends Omit<
    PopoverProps,
    'children' | 'contentRole' | 'onSelect'
  > {
  items: readonly DropdownItem[]
  closeOnSelect?: boolean
  onSelect?: (item: DropdownAction) => void
}

export function Dropdown({
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  closeOnSelect = true,
  disabled = false,
  className,
  contentClassName,
  ...props
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

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

  function getEnabledItems() {
    return Array.from(
      menuRef.current?.querySelectorAll<
        HTMLButtonElement
      >(
        '[role="menuitem"]:not(:disabled)',
      ) ?? [],
    )
  }

  function focusTrigger() {
    rootRef.current
      ?.querySelector<HTMLButtonElement>(
        '.ui-popover__trigger',
      )
      ?.focus()
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    menuRef.current
      ?.querySelector<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)',
      )
      ?.focus()
  }, [isOpen])

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    const buttons = getEnabledItems()

    if (event.key === 'Tab') {
      changeOpen(false)
      focusTrigger()
      return
    }

    if (buttons.length === 0) {
      return
    }

    const index = buttons.findIndex(
      button => button === document.activeElement,
    )

    let next: number

    switch (event.key) {
      case 'ArrowDown':
        next = (index + 1) % buttons.length
        break

      case 'ArrowUp':
        next =
          index <= 0
            ? buttons.length - 1
            : index - 1
        break

      case 'Home':
        next = 0
        break

      case 'End':
        next = buttons.length - 1
        break

      default:
        return
    }

    event.preventDefault()
    buttons[next]?.focus()
  }

  function selectItem(item: DropdownAction) {
    if (item.disabled) {
      return
    }

    if (closeOnSelect) {
      changeOpen(false)
      focusTrigger()
    }

    item.onSelect?.()
    onSelect?.(item)
  }

  return (
    <div
      ref={rootRef}
      className="ui-dropdown__wrapper"
    >
      <Popover
        {...props}
        open={isOpen}
        disabled={disabled}
        onOpenChange={changeOpen}
        contentRole="menu"
        className={classNames(
          'ui-dropdown',
          className,
        )}
        contentClassName={classNames(
          'ui-dropdown__panel',
          contentClassName,
        )}
      >
        <div
          ref={menuRef}
          className="ui-dropdown__menu"
          onKeyDown={handleKeyDown}
        >
          {items.map(item => {
            if (item.type === 'separator') {
              return (
                <div
                  key={item.id}
                  role="separator"
                  className="ui-dropdown__separator"
                />
              )
            }

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                className={classNames(
                  'ui-dropdown__item',
                  item.danger &&
                    'ui-dropdown__item--danger',
                )}
                onClick={() => selectItem(item)}
              >
                {item.icon != null && (
                  <span
                    className="ui-dropdown__icon"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                )}

                <span className="ui-dropdown__content">
                  <span className="ui-dropdown__label">
                    {item.label}
                  </span>

                  {item.description != null && (
                    <span
                      className="ui-dropdown__description"
                    >
                      {item.description}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </Popover>
    </div>
  )
}
