import type { ComponentPropsWithoutRef } from 'react'
import { useParams } from 'react-router-dom'

import { ContentContainer } from '../containers'
import { Logo } from '../../../components/Common'
import { Divider, Flex, Grid, Heading, Link, Paragraph, Stack, Text } from '../../../components/UI'
import { isLocale, siteContent } from '../../../i18n/content'
import { classNames } from '../../../Utils'

import './Footer.scss'

export type FooterProps = ComponentPropsWithoutRef<'footer'>

export function Footer({
  children,
  className,
  ...props
}: FooterProps) {
  const { locale: routeLocale } = useParams()
  const locale = isLocale(routeLocale) ? routeLocale : 'uk'
  const { footer, nav } = siteContent[locale]
  const home = `/${locale}`
  const email = import.meta.env.VITE_PUBLIC_CONTACT_EMAIL?.trim()

  return (
    <footer
      {...props}
      data-theme="dark"
      className={classNames('footer', className)}
    >
      <ContentContainer size="2xl">
        {children ?? (
          <Stack gap="xl">
            <Grid columns="var(--footer-columns)" className="footer__top" gap="xl" align="start">
              <Stack gap="sm" align="start">
                <Logo name="AVERON WEB" src="/brand/averon-logo.png" showName={false} href={home} smoothScroll />
                <Paragraph>{footer.tagline}</Paragraph>
              </Stack>
              <Stack gap="sm" align="start">
                <Heading level={2} as="h2" className="footer__heading">{footer.navigation}</Heading>
                {(['services', 'work', 'process'] as const).map(id => (
                  <Link href={`${home}#${id}`} variant="secondary" key={id}>{nav[id]}</Link>
                ))}
              </Stack>
              <Stack gap="sm" align="start">
                <Heading level={2} as="h2" className="footer__heading">{footer.contact}</Heading>
                <Link href={`${home}#contact`}>{nav.contact}</Link>
                {email && <Link href={`mailto:${email}`}>{email}</Link>}
              </Stack>
            </Grid>
            <Divider decorative />
            <Flex gap="md" wrap="wrap" justify="between" align="center">
              <Text size="sm">© {new Date().getFullYear()} AVERON WEB. {footer.rights}</Text>
              <Flex gap="md" wrap="wrap">
                <Link href={`${home}/privacy`} variant="secondary">{footer.privacy}</Link>
                <Link href={`${home}/terms`} variant="secondary">{footer.terms}</Link>
              </Flex>
              <Text size="sm" color="muted">BUILD. LAUNCH. EVOLVE.</Text>
            </Flex>
          </Stack>
        )}
      </ContentContainer>
    </footer>
  )
}
