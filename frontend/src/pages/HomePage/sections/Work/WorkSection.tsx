import { IoArrowForwardOutline } from 'react-icons/io5'
import { Section } from '../../../../components/Common'
import { Carousel, Container, Grid, Heading, Image, Link, Paragraph, Stack } from '../../../../components/UI'
import averonHomepage from '../../../../assets/images/averon-homepage.webp'
import luminaHomepage from '../../../../assets/images/lumina-homepage.webp'
import luminaLogo from '../../../../assets/images/logo-lumina-transparent.webp'
import { getTranslations, type Locale } from '../../../../i18n'

export function WorkSection({ locale }: { locale: Locale }) {
  const { hero, work } = getTranslations(locale)
  const featuredProjects = [
    {
      name: 'Lumina Beauty Studio',
      logo: luminaLogo,
      logoClassName: 'landing-work__project-logo--lumina',
      screenshot: luminaHomepage,
      description: work.luminaDescription,
      href: 'https://beauty-salon-project-nine.vercel.app/',
    },
    {
      name: 'Averon Web',
      logo: '/brand/averon-logo.webp',
      screenshot: averonHomepage,
      description: hero.description,
      href: `/${locale}`,
      lightLogo: true,
    },
  ]

  return (
    <Section id="work" className="landing-section landing-work" data-theme="light">
      <Container size="2xl">
        <Stack gap="lg">
          <Heading level={2} weight="bold" className="landing-work__heading">{work.title}</Heading>
          <Carousel
            label={work.title}
            previousLabel={work.previous}
            nextLabel={work.next}
            transitionDuration={1100}
            pagination
          >
            {featuredProjects.map(project => (
              <Grid
                as="article"
                key={project.name}
                columns="var(--work-slide-columns)"
                gap="md"
                align="center"
                className="landing-work__slide landing-work__slide--featured"
                style={{ rowGap: 'var(--gallery-featured-row-gap, var(--space-md))' }}
              >
                <div className="landing-work__laptop">
                  <Image src={project.screenshot} alt={project.name} wrapperClassName="landing-work__laptop-screen" aspectRatio="auto" fit="fill" />
                </div>
                <Stack gap="md" align="start" justify="evenly" className="landing-work__project-copy">
                  <div className="landing-work__project-details">
                    <Heading level={3} className="landing-work__project-title">
                      <Image
                        src={project.logo}
                        alt={project.name}
                        className={project.logoClassName}
                        wrapperClassName={project.lightLogo ? 'landing-work__project-logo--light' : undefined}
                      />
                    </Heading>
                    <Paragraph className="landing-card-description">{project.description}</Paragraph>
                  </div>
                  <Link
                    href={project.href}
                    appearance="button"
                    underline="none"
                    newTab
                    className="landing-project-action landing-work__project-action"
                    rightIcon={<IoArrowForwardOutline />}
                  >
                    {work.viewProject}
                  </Link>
                </Stack>
              </Grid>
            ))}
          </Carousel>
        </Stack>
      </Container>
    </Section>
  )
}
