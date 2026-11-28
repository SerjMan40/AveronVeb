import { Section } from '../../../../components/Common'
import { Card, CodeRain, Container, Grid, Heading, Image, Paragraph, Stack } from '../../../../components/UI'
import { portfolioCode } from '../Work/portfolioCode'
import { getTranslations, type Locale } from '../../../../i18n'
import { SectionHeading } from '../SectionHeading'
import websiteDevelopmentImage from '../../../../assets/images/services/website-development.webp'
import webDesignImage from '../../../../assets/images/services/web-design.webp'
import seoOptimizationImage from '../../../../assets/images/services/seo-optimization.webp'
import websiteMaintenanceImage from '../../../../assets/images/services/website-maintenance.webp'
import websiteImprovementImage from '../../../../assets/images/services/website-improvement.webp'

const seoServiceIndex = 2
const seoLabel = 'SEO'
const serviceImages = [
  websiteDevelopmentImage,
  webDesignImage,
  seoOptimizationImage,
  websiteMaintenanceImage,
  websiteImprovementImage,
]

export function ServicesSection({ locale }: { locale: Locale }) {
  const { services } = getTranslations(locale)

  return (
    <Section id="services" className="landing-section landing-services" data-theme="dark">
      <CodeRain className="landing-services__backdrop" sources={[portfolioCode]} continuous />
      <Container size="2xl">
        <Stack gap="lg">
          <SectionHeading
            title={services.title}
            titleAccent={services.titleAccent}
            intro={services.intro}
            align="center"
            className="landing-services__heading landing-services__copy-panel"
          />
          <Grid columns="var(--services-columns)" gap="md" className="landing-services__grid">
            {services.items.map(([name, description], index) => [
              index === seoServiceIndex && (
                <Grid
                  as="article"
                  key={name}
                  columns="var(--services-feature-columns)"
                  gap="xl"
                  align="center"
                  className="landing-services__seo"
                >
                  <Image src={seoOptimizationImage} alt="" radius="lg" aspectRatio="1117 / 685" loading="lazy" />
                  <Stack gap="sm" align="start" className="landing-services__copy-panel">
                    <Heading
                      level={3}
                      className="landing-services__title landing-services__seo-title"
                      balance
                    >
                      {seoLabel}{' '}
                      <span>{name.slice(seoLabel.length).trimStart()}</span>
                    </Heading>
                    <Paragraph size="2xl" color="primary" className="landing-card-description landing-services__description">{description}</Paragraph>
                  </Stack>
                </Grid>
              ),
              <Card
                as="article"
                className={index === seoServiceIndex ? 'landing-services__seo-card' : undefined}
                data-theme="dark"
                key={`${name}-card`}
                padding="lg"
                mediaPlacement="background"
                header={<Heading level={3} className="landing-services__title" balance>{name}</Heading>}
                media={serviceImages[index] && (
                  <Image src={serviceImages[index]} alt="" fit="cover" aspectRatio="auto" loading="lazy" />
                )}
              >
                <Paragraph size="2xl" className="landing-card-description landing-services__description">{description}</Paragraph>
              </Card>,
            ])}
          </Grid>
        </Stack>
      </Container>
    </Section>
  )
}
