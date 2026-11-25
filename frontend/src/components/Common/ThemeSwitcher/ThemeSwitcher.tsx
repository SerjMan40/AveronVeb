import type { ComponentPropsWithoutRef } from 'react'
import { classNames } from '../../../Utils'
import { Select } from '../../UI/Forms'

import './ThemeSwitcher.scss'

export interface ThemeSwitcherProps extends Omit<ComponentPropsWithoutRef<'label'>, 'children'> {
  label?: string
  lightLabel?: string
  darkLabel?: string
  systemLabel?: string
}

export function ThemeSwitcher({
  label = 'Theme',
  lightLabel = 'Light',
  darkLabel = 'Dark',
  systemLabel = 'System',
  className,
  ...props
}: ThemeSwitcherProps) {
  const theme = typeof document === 'undefined'
    ? undefined
    : document.documentElement.dataset.theme

  return (
    <label {...props} className={classNames('theme-switcher', className)}>
      <span>{label}</span>
      <Select
        defaultValue={theme === 'light' || theme === 'dark' ? theme : 'system'}
        onChange={({ currentTarget }) => {
          const { dataset } = document.documentElement
          if (currentTarget.value === 'system') {
            delete dataset.theme
          } else {
            dataset.theme = currentTarget.value
          }
        }}
      >
        <option value="system">{systemLabel}</option>
        <option value="light">{lightLabel}</option>
        <option value="dark">{darkLabel}</option>
      </Select>
    </label>
  )
}
