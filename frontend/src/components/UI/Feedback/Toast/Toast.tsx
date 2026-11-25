import { useEffect, useRef, useState } from 'react'
import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { Alert } from '../Alert'
import type { AlertVariant } from '../Alert'

import { classNames } from '../../../../Utils'

import './Toast.scss'

export type ToastVariant = AlertVariant

export interface ToastProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'title'
  > {
  variant?: ToastVariant
  title?: ReactNode
  duration?: number
  onClose: () => void
  pauseOnHover?: boolean
  showProgress?: boolean
  closeLabel?: string
  icon?: ReactNode
  actions?: ReactNode
}

export function Toast({
  variant = 'info',
  title,
  duration = 5000,
  onClose,
  pauseOnHover = true,
  showProgress = false,
  closeLabel = 'Close notification',
  icon,
  actions,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocusCapture,
  onBlurCapture,
  ...props
}: ToastProps) {
  const safeDuration =
    Number.isFinite(duration) && duration > 0
      ? duration
      : 0

  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [progress, setProgress] = useState(100)

  const remainingRef = useRef(safeDuration)
  const onCloseRef = useRef(onClose)

  const paused =
    (pauseOnHover && hovered) || focused

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    remainingRef.current = safeDuration
    setProgress(100)
  }, [safeDuration])

  useEffect(() => {
    if (safeDuration === 0 || paused) return

    const startedAt = performance.now()
    const remaining = remainingRef.current

    let frameId: number

    const timerId = window.setTimeout(() => {
      window.cancelAnimationFrame(frameId)
      remainingRef.current = 0
      setProgress(0)
      onCloseRef.current()
    }, remaining)

    function updateProgress() {
      const elapsed = performance.now() - startedAt

      const nextRemaining = Math.max(
        remaining - elapsed,
        0,
      )

      setProgress(
        (nextRemaining / safeDuration) * 100,
      )

      if (nextRemaining > 0) {
        frameId = window.requestAnimationFrame(
          updateProgress,
        )
      }
    }

    if (showProgress) {
      frameId = window.requestAnimationFrame(
        updateProgress,
      )
    }

    return () => {
      window.clearTimeout(timerId)
      window.cancelAnimationFrame(frameId)

      remainingRef.current = Math.max(
        remaining - (performance.now() - startedAt),
        0,
      )
    }
  }, [safeDuration, paused, showProgress])

  return (
    <div
      {...props}
      className={classNames(
        'ui-toast',
        `ui-toast--${variant}`,
        className,
      )}
      onMouseEnter={(event) => {
        setHovered(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        setHovered(false)
        onMouseLeave?.(event)
      }}
      onFocusCapture={(event) => {
        setFocused(true)
        onFocusCapture?.(event)
      }}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget,
          )
        ) {
          setFocused(false)
        }

        onBlurCapture?.(event)
      }}
    >
      <Alert
        variant={variant}
        title={title}
        icon={icon}
        actions={actions}
        onClose={onClose}
        closeLabel={closeLabel}
      >
        {children}
      </Alert>

      {showProgress && safeDuration > 0 && (
        <div
          className="ui-toast__progress"
          aria-hidden="true"
        >
          <div
            className="ui-toast__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}