import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Stepper.scss'

export type StepperOrientation =
  | 'horizontal'
  | 'vertical'

export type StepperStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'error'

export interface StepperItem {
  id: string
  label: ReactNode
  description?: ReactNode
  icon?: ReactNode
  status?: StepperStatus
  disabled?: boolean
}

export interface StepperProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children' | 'onChange'
  > {
  steps: readonly StepperItem[]
  activeStep: number
  orientation?: StepperOrientation
  clickable?: boolean
  linear?: boolean
  onChange?: (index: number) => void
  ariaLabel?: string
  statusLabels?: Partial<
    Record<StepperStatus, string>
  >
}

const defaultStatusLabels:
  Record<StepperStatus, string> = {
    pending: 'Pending',
    active: 'Current',
    completed: 'Completed',
    error: 'Error',
  }

export function Stepper({
  steps,
  activeStep,
  orientation = 'horizontal',
  clickable = false,
  linear = true,
  onChange,
  ariaLabel = 'Progress steps',
  statusLabels,
  className,
  ...props
}: StepperProps) {
  if (steps.length === 0) {
    return null
  }

  const current = Number.isFinite(activeStep)
    ? Math.min(
        steps.length - 1,
        Math.max(0, Math.floor(activeStep)),
      )
    : 0

  const labels = {
    ...defaultStatusLabels,
    ...statusLabels,
  }

  return (
    <div
      {...props}
      role="group"
      aria-label={props['aria-label'] ?? ariaLabel}
      className={classNames(
        'ui-stepper',
        `ui-stepper--${orientation}`,
        className,
      )}
    >
      <ol className="ui-stepper__list">
        {steps.map((step, index) => {
          const status: StepperStatus =
            step.status ??
            (
              index < current
                ? 'completed'
                : index === current
                  ? 'active'
                  : 'pending'
            )

          const isCurrent = index === current

          const isInteractive =
            clickable && onChange !== undefined

          const isDisabled =
            step.disabled ||
            (linear && index > current)

          const content = (
            <>
              <span
                className="ui-stepper__indicator"
                aria-hidden="true"
              >
                {step.icon ??
                  (
                    status === 'completed'
                      ? '✓'
                      : status === 'error'
                        ? '!'
                        : index + 1
                  )}
              </span>

              <span className="ui-stepper__content">
                <span className="ui-stepper__label">
                  {step.label}
                </span>

                {step.description != null && (
                  <span
                    className="ui-stepper__description"
                  >
                    {step.description}
                  </span>
                )}

                <span className="ui-stepper__status">
                  {labels[status]}
                </span>
              </span>
            </>
          )

          return (
            <li
              key={step.id}
              className={classNames(
                'ui-stepper__item',
                `ui-stepper__item--${status}`,
              )}
              aria-current={
                isCurrent ? 'step' : undefined
              }
            >
              {isInteractive ? (
                <button
                  type="button"
                  disabled={isDisabled}
                  className="ui-stepper__trigger"
                  onClick={() => onChange(index)}
                >
                  {content}
                </button>
              ) : (
                <div className="ui-stepper__trigger">
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
