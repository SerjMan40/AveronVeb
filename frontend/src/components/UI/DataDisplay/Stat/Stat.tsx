import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'
import { classNames } from '../../../../Utils'

import './Stat.scss'

export type StatSize = 'sm' | 'md' | 'lg'

export type StatAlign = 'start' | 'center' | 'end'

export type StatTrend = 'up' | 'down' | 'neutral'

export type StatTrendTone =
  | 'positive'
  | 'negative'
  | 'neutral'

export interface StatProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  label: ReactNode
  value: ReactNode
  description?: ReactNode
  icon?: ReactNode
  trend?: StatTrend
  trendValue?: ReactNode
  trendTone?: StatTrendTone
  size?: StatSize
  align?: StatAlign
}

const trendSymbols: Record<StatTrend, string> = {
  up: '↑',
  down: '↓',
  neutral: '−',
}

export function Stat({
  label,
  value,
  description,
  icon,
  trend,
  trendValue,
  trendTone = 'neutral',
  size = 'md',
  align = 'start',
  className,
  ...props
}: StatProps) {
  return (
    <div
      {...props}
      className={classNames(
        'ui-stat',
        `ui-stat--${size}`,
        `ui-stat--align-${align}`,
        className,
      )}
    >
      <div className="ui-stat__header">
        <span className="ui-stat__label">
          {label}
        </span>

        {icon != null && (
          <span
            className="ui-stat__icon"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <div className="ui-stat__value">
        {value}
      </div>

      {trendValue != null && (
        <div
          className={classNames(
            'ui-stat__trend',
            `ui-stat__trend--${trendTone}`,
          )}
        >
          {trend && (
            <span aria-hidden="true">
              {trendSymbols[trend]}
            </span>
          )}

          {trendValue}
        </div>
      )}

      {description != null && (
        <div className="ui-stat__description">
          {description}
        </div>
      )}
    </div>
  )
}