import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../../Utils'

import './Slider.scss'

export type SliderProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'children'
>

export function Slider({
  className,
  ...props
}: SliderProps) {
  return (
    <input
      {...props}
      type="range"
      className={classNames(
        'ui-slider',
        className,
      )}
    />
  )
}
