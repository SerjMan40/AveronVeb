import {
  useId,
  useState,
  useRef,
} from 'react'

import type {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Tabs.scss'

export type TabsOrientation =
  | 'horizontal'
  | 'vertical'

export type TabsVariant =
  | 'underline'
  | 'pills'
  | 'outline'

export type TabsActivation =
  | 'automatic'
  | 'manual'

export interface TabItem {
  id: string
  label: ReactNode
  content: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface TabsProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children' | 'onChange' | 'defaultValue'
  > {
  items: readonly TabItem[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  orientation?: TabsOrientation
  variant?: TabsVariant
  activation?: TabsActivation
  fullWidth?: boolean
  keepMounted?: boolean
  ariaLabel?: string
}

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  orientation = 'horizontal',
  variant = 'underline',
  activation = 'automatic',
  fullWidth = false,
  keepMounted = true,
  ariaLabel = 'Tabs',
  className,
  ...props
}: TabsProps) {
  const id = useId()

  const buttonsRef = useRef(
    new Map<string, HTMLButtonElement>(),
  )

  const enabledItems = items.filter(
    item => !item.disabled,
  )

  const firstEnabled = enabledItems[0]?.id

  const [internalValue, setInternalValue] =
    useState<string | undefined>(
      defaultValue ?? firstEnabled,
    )

  const [focusedValue, setFocusedValue] =
    useState<string | undefined>()

  const controlled = value !== undefined

  const requestedValue =
    controlled ? value : internalValue

  const activeValue = enabledItems.some(
    item => item.id === requestedValue,
  )
    ? requestedValue
    : controlled
      ? undefined
      : firstEnabled

  const tabStopValue = enabledItems.some(
    item => item.id === focusedValue,
  )
    ? focusedValue
    : activeValue ?? firstEnabled

  function selectTab(next: string) {
    const item = items.find(
      entry => entry.id === next,
    )

    if (
      !item ||
      item.disabled ||
      next === activeValue
    ) {
      return
    }

    if (!controlled) {
      setInternalValue(next)
    }

    onChange?.(next)
  }

  function focusTab(next: string) {
    setFocusedValue(next)
    buttonsRef.current.get(next)?.focus()

    if (activation === 'automatic') {
      selectTab(next)
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentId: string,
  ) {
    const index = enabledItems.findIndex(
      item => item.id === currentId,
    )

    if (index < 0 || enabledItems.length === 0) {
      return
    }

    const last = enabledItems.length - 1

    const rtl =
      orientation === 'horizontal' &&
      getComputedStyle(event.currentTarget)
        .direction === 'rtl'

    const previousKey =
      orientation === 'horizontal'
        ? rtl ? 'ArrowRight' : 'ArrowLeft'
        : 'ArrowUp'

    const nextKey =
      orientation === 'horizontal'
        ? rtl ? 'ArrowLeft' : 'ArrowRight'
        : 'ArrowDown'

    let nextIndex: number

    switch (event.key) {
      case previousKey:
        nextIndex = index === 0
          ? last
          : index - 1
        break

      case nextKey:
        nextIndex = index === last
          ? 0
          : index + 1
        break

      case 'Home':
        nextIndex = 0
        break

      case 'End':
        nextIndex = last
        break

      default:
        return
    }

    event.preventDefault()

    const nextItem = enabledItems[nextIndex]

    if (nextItem) {
      focusTab(nextItem.id)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div
      {...props}
      className={classNames(
        'ui-tabs',
        `ui-tabs--${orientation}`,
        `ui-tabs--${variant}`,
        fullWidth && 'ui-tabs--full-width',
        className,
      )}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className="ui-tabs__list"
      >
        {items.map((item, index) => {
          const active = item.id === activeValue

          const tabId =
            id + '-tab-' + index

          const panelId =
            id + '-panel-' + index

          return (
            <button
              key={item.id}
              ref={element => {
                if (element) {
                  buttonsRef.current.set(
                    item.id,
                    element,
                  )
                } else {
                  buttonsRef.current.delete(item.id)
                }
              }}
              type="button"
              role="tab"
              id={tabId}
              disabled={item.disabled}
              aria-selected={active}
              aria-controls={panelId}
              tabIndex={
                item.id === tabStopValue ? 0 : -1
              }
              className={classNames(
                'ui-tabs__tab',
                active && 'ui-tabs__tab--active',
              )}
              onFocus={() => {
                setFocusedValue(item.id)
              }}
              onClick={() => selectTab(item.id)}
              onKeyDown={event =>
                handleKeyDown(event, item.id)
              }
            >
              {item.icon != null && (
                <span
                  className="ui-tabs__icon"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
              )}

              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="ui-tabs__panels">
        {items.map((item, index) => {
          const active = item.id === activeValue

          return (
            <div
              key={item.id}
              role="tabpanel"
              id={id + '-panel-' + index}
              aria-labelledby={
                id + '-tab-' + index
              }
              hidden={!active}
              tabIndex={active ? 0 : -1}
              className="ui-tabs__panel"
            >
              {(keepMounted || active) &&
                item.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
