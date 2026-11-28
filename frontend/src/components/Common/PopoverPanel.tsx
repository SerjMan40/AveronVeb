import { Divider, Popover, Stack, Text, type PopoverProps } from '../UI'

type PopoverPanelProps = Omit<PopoverProps, 'align' | 'appearance'> & {
  heading: string
}

export function PopoverPanel({ heading, children, ...props }: PopoverPanelProps) {
  return (
    <Popover {...props} align="end" appearance="accent">
      <Stack gap="xs">
        <Text size="xs" align="center" transform="uppercase" weight="semibold" color="secondary" aria-hidden="true">
          {heading}
        </Text>
        <Divider spacing="none" decorative />
        {children}
      </Stack>
    </Popover>
  )
}
