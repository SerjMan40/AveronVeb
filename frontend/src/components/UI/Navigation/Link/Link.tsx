import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react'

import { Link as RouterLink } from 'react-router-dom'

import { classNames } from '../../../../Utils'

import './Link.scss'

export type LinkVariant =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inherit'

export type LinkUnderline =
  | 'always'
  | 'hover'
  | 'none'

export interface LinkProps
  extends Omit<
    ComponentPropsWithoutRef<'a'>,
    'href'
  > {
  href: string
  state?: unknown
  variant?: LinkVariant
  underline?: LinkUnderline
  appearance?: 'text' | 'button' | 'button-outline'
  external?: boolean
  newTab?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Link({
  href,
  state,
  variant = 'primary',
  underline = 'hover',
  appearance = 'text',
  external,
  newTab = false,
  leftIcon,
  rightIcon,
  children,
  className,
  target,
  rel,
  download,
  ...props
}: LinkProps) {
  const isExternal =
    external ??
    /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)

  const resolvedTarget =
    newTab ? '_blank' : target

  const resolvedRel =
    resolvedTarget === '_blank'
      ? Array.from(
          new Set([
            ...(rel?.split(/\s+/).filter(Boolean) ?? []),
            'noopener',
            'noreferrer',
          ]),
        ).join(' ')
      : rel

  const linkClassName = classNames(
    'ui-link',
    `ui-link--${variant}`,
    `ui-link--underline-${underline}`,
    appearance !== 'text' && 'ui-link--button',
    appearance === 'button-outline' && 'ui-link--button-outline',
    className,
  )

  const content = (
    <>
      {leftIcon != null && (
        <span
          className="ui-link__icon"
          aria-hidden="true"
        >
          {leftIcon}
        </span>
      )}

      <span className="ui-link__content">
        {children}
      </span>

      {rightIcon != null && (
        <span
          className="ui-link__icon"
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
    </>
  )

  if (
    isExternal ||
    href.startsWith('#') ||
    download != null
  ) {
    return (
      <a
        {...props}
        href={href}
        target={resolvedTarget}
        rel={resolvedRel}
        download={download}
        className={linkClassName}
      >
        {content}
      </a>
    )
  }

  return (
    <RouterLink
      {...props}
      to={href}
      state={state}
      target={resolvedTarget}
      rel={resolvedRel}
      className={linkClassName}
    >
      {content}
    </RouterLink>
  )
}
