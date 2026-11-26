import { Section } from '../../../../components/Common'
import { Container, Grid, Heading, Paragraph, Stack } from '../../../../components/UI'
import { siteContent, type Locale } from '../../../../i18n/content'

export function ProcessSection({ locale }: { locale: Locale }) {
  const { process } = siteContent[locale]

  return (
    <Section id="process" className="landing-section landing-process" data-theme="dark">
      <Container size="2xl">
        <Stack gap="xl">
          <Stack gap="sm" className="landing-section__heading">
            <Heading level={2} accent={process.titleAccent}>{process.title}</Heading>
            <Paragraph className="landing-section__intro">{process.intro}</Paragraph>
          </Stack>
          <Grid columns="var(--process-columns)" style={{ gap: 'clamp(2rem, 5vw, 5.2rem)' }} className="landing-process__grid">
            <div className="model-card">
              <div className="model-card__orbit">
                {['PLAN', 'DESIGN', 'BUILD', 'LAUNCH', 'EVOLVE'].map(stage => (
                  <span key={stage} className="model-card__orbit-stage" aria-hidden="true">{stage}</span>
                ))}
                <img
                  className="model-card__orbit-logo"
                  src="/brand/averon-logo.png"
                  alt="AVERON WEB"
                  loading="lazy"
                />
              </div>
            </div>
            <ol className="landing-process__steps" role="list">
              {process.steps.map((title, index) => (
                <li className="landing-process__step" key={title}>
                  <span className="landing-process__number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Heading level={3}>{title}</Heading>
                  <span className="landing-process__arrow" aria-hidden="true">↗</span>
                </li>
              ))}
            </ol>
          </Grid>
        </Stack>
      </Container>
    </Section>
  )
}
