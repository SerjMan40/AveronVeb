import { Heading, Paragraph, Stack, type StackAlign } from '../../../components/UI'
import { classNames } from '../../../Utils'

interface SectionHeadingProps {
  title: string
  titleAccent: string
  intro: string
  align?: StackAlign
  className?: string
}

export function SectionHeading({ title, titleAccent, intro, align, className }: SectionHeadingProps) {
  return (
    <Stack gap="sm" align={align} className={classNames('landing-section__heading', className)}>
      <Heading level={2} accent={titleAccent}>{title}</Heading>
      <Paragraph className="landing-section__intro">{intro}</Paragraph>
    </Stack>
  )
}
