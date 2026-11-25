import { useId, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from '../../../../Utils'

import './Accordion.scss'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children' | 'onChange' | 'defaultValue'
  > {
  items: readonly AccordionItem[]
  multiple?: boolean
  value?: readonly string[]
  defaultValue?: readonly string[]
  onChange?: (value: string[]) => void
}

export function Accordion({
  items,
  multiple = false,
  value,
  defaultValue = [],
  onChange,
  className,
  ...props
}: AccordionProps) {
  const accordionId = useId()
  const [internalValue, setInternalValue] = useState<string[]>(
    () => [...defaultValue],
  )

  const selected = value ?? internalValue
  const openItems = multiple ? selected : selected.slice(0, 1)

  function toggle(id: string) {
    const nextValue = openItems.includes(id)
      ? openItems.filter((item) => item !== id)
      : multiple
        ? [...openItems, id]
        : [id]

    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  return (
    <div
      {...props}
      className={classNames('ui-accordion', className)}
    >
      {items.map(({ id, title, content, disabled }) => {
        const isOpen = openItems.includes(id)
        const triggerId = `${accordionId}-${id}-trigger`
        const panelId = `${accordionId}-${id}-panel`

        return (
          <div
            key={id}
            className={classNames(
              'ui-accordion__item',
              isOpen && 'ui-accordion__item--open',
            )}
          >
            <h3 className="ui-accordion__heading">
              <button
                id={triggerId}
                type="button"
                className="ui-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={disabled}
                onClick={() => toggle(id)}
              >
                <span>{title}</span>

                <span
                  className="ui-accordion__icon"
                  aria-hidden="true"
                />
              </button>
            </h3>

            <div
              id={panelId}
              className="ui-accordion__content"
              hidden={!isOpen}
            >
              {content}
            </div>
          </div>
        )
      })}
    </div>
  )
}