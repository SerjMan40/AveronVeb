import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import { classNames } from '../../../../Utils'
import { CodeMarquee } from '../CodeMarquee'

import './CodeRain.scss'

const glyphs = '010101<>/{}[]:;*+%=XYZ'

const glyphColumns = Array.from({ length: 24 }, (_, column) =>
  Array.from({ length: 48 }, (_, row) => {
    if ((column + row) % 13 === 0) return ' '
    return glyphs[(column * 7 + row * 5 + row * row) % glyphs.length]
  }).join('\n'),
)

export interface CodeRainProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  sources?: readonly string[]
  continuous?: boolean
}

export function CodeRain({ sources, continuous, className, ...props }: CodeRainProps) {
  const columns = sources?.length ? sources : glyphColumns
  const sourceMode = columns !== glyphColumns

  return (
    <div
      {...props}
      className={classNames('ui-code-rain', sourceMode && 'ui-code-rain--source', className)}
      aria-hidden="true"
    >
      {columns.map((code, index) => (
        <CodeMarquee
          key={index}
          code={code}
          orientation="vertical"
          continuous={continuous}
          style={{
            '--code-marquee-duration': `var(--code-rain-duration, ${(sourceMode ? 24 : 14) + (index % 8) * 2}s)`,
            '--code-marquee-delay': `-${index * 1.7}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}
