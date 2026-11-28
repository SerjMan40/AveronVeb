import type { ComponentPropsWithoutRef } from 'react'
import { IoCallOutline } from 'react-icons/io5'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTelegramPlane } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import { contactPhone, contactPhoneHref } from '../contactPhone'
import { sectionIds } from '../sectionIds'
import { Logo } from '../../../components/Common'
import { Container, Divider, Flex, Grid, Heading, Link, Paragraph, Stack, Text } from '../../../components/UI'
import { getTranslations, resolveLocale } from '../../../i18n'
import { classNames } from '../../../Utils'

import './Footer.scss'

export type FooterProps = ComponentPropsWithoutRef<'footer'>

const socialLinks = [
  { label: 'Facebook', icon: FaFacebookF, url: import.meta.env.VITE_PUBLIC_FACEBOOK_URL },
  { label: 'Telegram', icon: FaTelegramPlane, url: import.meta.env.VITE_PUBLIC_TELEGRAM_URL },
  { label: 'Instagram', icon: FaInstagram, url: import.meta.env.VITE_PUBLIC_INSTAGRAM_URL },
  { label: 'LinkedIn', icon: FaLinkedinIn, url: import.meta.env.VITE_PUBLIC_LINKEDIN_URL },
].map(({ url, ...social }) => {
  const href = url?.trim() ?? ''
  const isValid = /^https:\/\/[^\s/]+/i.test(href)

  return { ...social, href: isValid ? href : undefined }
})

const smoothScroll = { smoothScroll: true }

export function Footer({
  children,
  className,
  ...props
}: FooterProps) {
  const { locale: routeLocale } = useParams()
  const locale = resolveLocale(routeLocale)
  const { footer, nav } = getTranslations(locale)
  const home = `/${locale}`
  const email = import.meta.env.VITE_PUBLIC_CONTACT_EMAIL?.trim()

  return (
    <footer
      {...props}
      data-theme="dark"
      className={classNames('footer', className)}
    >
      <Container size="2xl">
        {children ?? (
          <Stack gap="md">
            <Grid columns="var(--footer-columns)" className="footer__top" gap="xl" align="start">
              <Stack gap="sm" align="start" className="footer__brand">
                <Logo name="AVERON WEB" src="/brand/averon-logo.webp" showName={false} href={home} smoothScroll />
                <Paragraph lang="en">Build. Launch. Evolve.</Paragraph>
              </Stack>
              <Stack gap="xs" align="start">
                <Heading level={2} className="footer__heading">{footer.navigation}</Heading>
                <nav className="footer__navigation" aria-label={footer.navigation}>
                  {sectionIds.map(id => (
                    <Link href={`${home}#${id}`} state={smoothScroll} variant="secondary" key={id}>{nav[id]}</Link>
                  ))}
                </nav>
              </Stack>
              <Stack gap="sm" align="start">
                <Heading level={2} as="h2" className="footer__heading">{footer.contact}</Heading>
                <Link href={contactPhoneHref} leftIcon={<IoCallOutline />}>{contactPhone}</Link>
                {email && <Link href={`mailto:${email}`}>{email}</Link>}
                <Flex gap="xs" wrap="wrap">
                  {socialLinks.map(({ label, icon: SocialIcon, href }) => (
                    href ? (
                      <Link
                        key={label}
                        href={href}
                        newTab
                        aria-label={label}
                        title={label}
                        underline="none"
                        className="footer__social-link"
                        leftIcon={<SocialIcon />}
                      />
                    ) : (
                      <span key={label} className="footer__social-link" role="img" aria-label={label} title={label}>
                        <SocialIcon aria-hidden="true" />
                      </span>
                    )
                  ))}
                </Flex>
              </Stack>
            </Grid>
            <Divider decorative />
            <Flex gap="md" wrap="wrap" justify="between" align="center">
              <Text size="sm">© {new Date().getFullYear()} AVERON WEB. {footer.rights}</Text>
            </Flex>
          </Stack>
        )}
      </Container>
    </footer>
  )
}
