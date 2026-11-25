import { Text } from '../Text'

import type { TextProps } from '../Text'

import { classNames } from '../../../../Utils'

import './Paragraph.scss'

export interface ParagraphProps
  extends Omit<TextProps, 'as'> {
  lead?: boolean
  pretty?: boolean
}

export function Paragraph({
  size,
  weight = 'regular',
  color = 'primary',
  lineHeight = 'base',
  lead = false,
  pretty = false,
  truncate = false,
  lineClamp,
  noWrap = false,
  className,
  children,
  ...props
}: ParagraphProps) {
  return (
    <Text
      {...props}
      as="p"
      size={size ?? (lead ? 'lg' : 'md')}
      weight={weight}
      color={color}
      lineHeight={lineHeight}
      truncate={truncate}
      lineClamp={lineClamp}
      noWrap={noWrap}
      className={classNames(
        'ui-paragraph',
        lead && 'ui-paragraph--lead',
        pretty &&
          !truncate &&
          lineClamp === undefined &&
          !noWrap &&
          'ui-paragraph--pretty',
        className,
      )}
    >
      {children}
    </Text>
  )
}
