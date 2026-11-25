import { Section } from '../../../../components/Common'
import { Badge, Card, Container, Grid, Heading, Link, List, Paragraph, Stack } from '../../../../components/UI'
import { siteContent, type Locale } from '../../../../i18n/content'

export function ProcessSection({ locale }: { locale: Locale }) {
  const { process } = siteContent[locale]

  return (
    <Section id="process" className="landing-section landing-section--light" data-theme="light">
      <Container size="2xl">
        <Stack gap="lg">
          <Stack gap="sm" className="landing-section__heading">
            <Heading level={2} accent={process.titleAccent}>{process.title}</Heading>
            <Paragraph className="landing-section__intro">{process.intro}</Paragraph>
          </Stack>
          <Card variant="filled" padding="lg" style={{ alignItems: 'stretch' }}>
            <List<readonly [string, string]>
              marker="decimal"
              variant="divided"
              items={process.steps}
              getKey={([title]) => title}
              renderItem={([title, description]) => (
                <Stack gap="xs">
                  <Heading level={3}>{title}</Heading>
                  <Paragraph>{description}</Paragraph>
                </Stack>
              )}
            />
          </Card>
        </Stack>
      </Container>
    </Section>
  )
}

export function PartnershipSection({ locale }: { locale: Locale }) {
  const { nav, process } = siteContent[locale]

  return (
    <Section id="partnership" className="landing-section landing-section--light" data-theme="light">
      <Container size="2xl">
        <Grid columns="var(--process-columns)" className="landing-process__grid" gap="xl" align="center">
          <Stack gap="md" align="start">
            <Badge variant="primary">{nav.partnership}</Badge>
            <Heading level={2} accent={process.modelTitleAccent}>{process.modelTitle}</Heading>
            <Paragraph className="landing-section__intro">{process.modelText}</Paragraph>
          </Stack>
          <div className="model-card__orbit" aria-hidden="true">
            <span>BUILD</span><span>LAUNCH</span><span>EVOLVE</span><i />
          </div>
        </Grid>
      </Container>
    </Section>
  )
}

export function BuyoutSection({ locale }: { locale: Locale }) {
  const { process, hero } = siteContent[locale]

  return (
    <Section id="buyout" className="landing-section landing-section--light" data-theme="light">
      <Container size="2xl">
        <Stack gap="md" align="start">
          <Heading level={2} accent={process.buyoutTitleAccent}>{process.buyoutTitle}</Heading>
          <Paragraph className="landing-section__intro">{process.buyout}</Paragraph>
          <Paragraph color="secondary">{process.fineprint}</Paragraph>
          <Link href="#contact">{hero.primary}</Link>
        </Stack>
      </Container>
    </Section>
  )
}
