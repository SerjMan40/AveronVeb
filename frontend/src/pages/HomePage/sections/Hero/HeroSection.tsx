import { PageHeader, Section } from '../../../../components/Common'
import { BorderWink, Card, Container, Flex, Icon, Image, Link, Paragraph, Stack, Text } from '../../../../components/UI'
import { IoArrowForwardOutline, IoEllipse } from 'react-icons/io5'
import { getTranslations, type Locale } from '../../../../i18n'

export function HeroSection({ locale }: { locale: Locale }) {
  const { hero } = getTranslations(locale)

  return (
    <Section id="home" className="landing-hero" data-theme="dark">
      <Card
        className="landing-hero__surface"
        variant="plain"
        padding="none"
        mediaPlacement="background"
        media={<Image src="/brand/hero-background.jpg" alt={hero.visualLabel} fit="cover" aspectRatio="auto" loading="eager" fetchPriority="high" />}
      >
        <Container size="2xl">
          <Stack gap="lg" align="start" className="landing-hero__copy">
            <Flex align="center" gap="xs">
              <Icon size="xs" variant="info"><IoEllipse /></Icon>
              <Text size="lg" color="info" weight="medium">{hero.eyebrow}</Text>
            </Flex>
            <PageHeader
              heading={<>{hero.title} <Text color="primary" className="landing-hero__accent">{hero.titleAccent}</Text></>}
              description={<Paragraph className="landing-card-description">{hero.description}</Paragraph>}
            />
            <BorderWink>
              <Link
                className="landing-project-action"
                href={`/${locale}#contact`}
                state={{ smoothScroll: true }}
                appearance="button"
                underline="none"
                rightIcon={<IoArrowForwardOutline />}
              >
                {hero.primary}
              </Link>
            </BorderWink>
          </Stack>
        </Container>
      </Card>
    </Section>
  )
}
