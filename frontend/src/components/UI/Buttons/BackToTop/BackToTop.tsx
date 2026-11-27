import { useEffect, useState } from 'react'
import { classNames } from '../../../../Utils'
import { IconButton, type IconButtonProps } from '../IconButton'

import './BackToTop.scss'

export interface BackToTopProps
  extends Omit<IconButtonProps, 'onClick' | 'tabIndex' | 'aria-hidden'> {
  threshold?: number
}

export function BackToTop({
  threshold = 480,
  variant = 'primary',
  className,
  ...props
}: BackToTopProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > threshold)
    window.addEventListener('scroll', updateVisibility, { passive: true })
    updateVisibility()
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [threshold])

  return (
    <IconButton
      {...props}
      type="button"
      variant={variant}
      className={classNames('ui-back-to-top', visible && 'ui-back-to-top--visible', className)}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
      }}
    />
  )
}
