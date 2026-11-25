import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import type {
  ComponentPropsWithoutRef,
  ReactElement,
} from 'react'

import { cloneElement } from 'react'

import { classNames } from '../../../../Utils'

import './Tooltip.scss'

export type TooltipPlacement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'

type TooltipChildProps = {
  'aria-describedby'?: string
}

export interface TooltipProps
  extends Omit<
    ComponentPropsWithoutRef<'span'>,
    'children' | 'content'
  > {
  children: ReactElement<TooltipChildProps>
  content: string
  placement?: TooltipPlacement
  delay?: number
  hideDelay?: number
  disabled?: boolean
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  delay = 300,
  hideDelay = 100,
  disabled = false,
  className,
  ...props
}: TooltipProps) {
  const id = useId()

  const [visible, setVisible] = useState(false)

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    )

  const hoveredRef = useRef(false)
  const focusedRef = useRef(false)

  const isVisible =
    visible && !disabled && Boolean(content)

  function clearTimer() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function scheduleShow() {
    clearTimer()

    if (disabled || !content) {
      return
    }

    timerRef.current = setTimeout(() => {
      setVisible(true)
      timerRef.current = null
    }, Math.max(0, delay))
  }

  function scheduleHide() {
    if (
      hoveredRef.current ||
      focusedRef.current
    ) {
      return
    }

    clearTimer()

    timerRef.current = setTimeout(() => {
      setVisible(false)
      timerRef.current = null
    }, Math.max(0, hideDelay))
  }

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) {
      return
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }

        setVisible(false)
      }
    }

    document.addEventListener(
      'keydown',
      handleEscape,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      )
    }
  }, [isVisible])

  const describedBy = [
    children.props['aria-describedby'],
    !disabled && content ? id : undefined,
  ].filter(Boolean).join(' ') || undefined

  return (
    <span
      {...props}
      className={classNames(
        'ui-tooltip',
        `ui-tooltip--${placement}`,
        isVisible && 'ui-tooltip--visible',
        className,
      )}
      onMouseEnter={event => {
        hoveredRef.current = true
        scheduleShow()
        props.onMouseEnter?.(event)
      }}
      onMouseLeave={event => {
        hoveredRef.current = false
        scheduleHide()
        props.onMouseLeave?.(event)
      }}
      onFocusCapture={event => {
        focusedRef.current = true
        scheduleShow()
        props.onFocusCapture?.(event)
      }}
      onBlurCapture={event => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget,
          )
        ) {
          focusedRef.current = false
          scheduleHide()
        }

        props.onBlurCapture?.(event)
      }}
    >
      {cloneElement(children, {
        'aria-describedby': describedBy,
      })}

      {!disabled && content && (
        <span
          id={id}
          role="tooltip"
          className="ui-tooltip__content"
        >
          {content}
        </span>
      )}
    </span>
  )
}
