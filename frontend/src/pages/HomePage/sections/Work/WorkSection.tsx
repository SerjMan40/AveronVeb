import { useState } from 'react'
import { IoArrowForwardOutline } from 'react-icons/io5'
import { Section } from '../../../../components/Common'
import { Badge, Button, Card, Carousel, Container, Grid, Heading, Image, Link, Modal, Paragraph, Stack } from '../../../../components/UI'
import averonHomepage from '../../../../assets/images/averon-homepage.png'
import luminaHomepage from '../../../../assets/images/lumina-homepage.png'
import luminaLogo from '../../../../assets/images/logo-lumina-transparent.png'
import { siteContent, type Locale } from '../../../../i18n/content'
import { ProjectPreview } from './ProjectPreview'

type Project = (typeof siteContent)[Locale]['work']['projects'][number]

const slideLabels = {
  uk: { previous: 'Попередня робота', next: 'Наступна робота' },
  en: { previous: 'Previous project', next: 'Next project' },
  ru: { previous: 'Предыдущая работа', next: 'Следующая работа' },
} as const

const galleryLabels = {
  uk: { description: 'Сучасний сайт для салону краси з онлайн-записом і керуванням послугами.', view: 'Переглянути проєкт', upcoming: 'Проєкт готується' },
  en: { description: 'A modern website for a beauty salon with online booking and service management.', view: 'View project', upcoming: 'Project coming soon' },
  ru: { description: 'Современный сайт для салона красоты с онлайн-записью и управлением услугами.', view: 'Посмотреть проект', upcoming: 'Проект готовится' },
} as const

export function WorkSection({ locale }: { locale: Locale }) {
  const { hero, work } = siteContent[locale]
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const labels = slideLabels[locale]
  const gallery = galleryLabels[locale]
  const featuredProjects = [
    {
      name: 'Lumina Beauty Studio',
      logo: luminaLogo,
      screenshot: luminaHomepage,
      description: gallery.description,
      href: 'https://beauty-salon-project-nine.vercel.app/',
    },
    {
      name: 'Averon Web',
      logo: '/brand/averon-logo.png',
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
            previousLabel={labels.previous}
            nextLabel={labels.next}
            transitionDuration={1100}
            effect="fade"
            pagination
          >
            {featuredProjects.map(project => (
              <Grid as="article" key={project.name} columns="var(--work-slide-columns)" gap="md" align="center" className="landing-work__slide landing-work__slide--featured">
                <div className="landing-work__laptop">
                  <Image src={project.screenshot} alt={project.name} wrapperClassName="landing-work__laptop-screen" aspectRatio="auto" fit="fill" />
                </div>
                <Stack gap="md" align="start" justify="evenly" className="landing-work__project-copy">
                  <Heading level={3} className="landing-work__project-title">
                    <Image src={project.logo} alt={project.name} wrapperClassName={project.lightLogo ? 'landing-work__project-logo--light' : undefined} />
                  </Heading>
                  <Paragraph className="landing-card-description">{project.description}</Paragraph>
                  <Link
                    href={project.href}
                    appearance="button"
                    underline="none"
                    newTab
                    className="landing-project-action landing-work__project-action"
                    rightIcon={<IoArrowForwardOutline />}
                  >
                    {gallery.view}
                  </Link>
                </Stack>
              </Grid>
            ))}
            {work.projects.map(project => (
              <Card
                as="article"
                key={project.name}
                variant="plain"
                padding="none"
                className="landing-work__slide"
                data-theme="light"
              >
                <Grid columns="var(--work-slide-columns)" gap="lg" align="center">
                  <ProjectPreview kind={project.kind} large />
                  <Stack gap="sm" align="start">
                    <Badge>{project.category}</Badge>
                    <Heading level={3}>{project.name}</Heading>
                    <Paragraph>{project.description}</Paragraph>
                    <Badge>{work.concept}</Badge>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedProject(project)}
                      aria-label={`${work.open}: ${project.name}`}
                    >
                      {work.open}
                    </Button>
                  </Stack>
                </Grid>
              </Card>
            ))}
            <Card
              as="article"
              variant="plain"
              padding="none"
              className="landing-work__slide landing-work__slide--pending"
            >
              <Heading level={3}>{gallery.upcoming}</Heading>
            </Card>
          </Carousel>
        </Stack>
      </Container>
      <Modal
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name}
        closeLabel={work.close}
        closeOnBackdrop={false}
      >
        {selectedProject && (
          <Stack gap="md" align="start">
            <ProjectPreview kind={selectedProject.kind} large />
            <Badge>{work.conceptLabel}</Badge>
            <Badge>{selectedProject.category}</Badge>
            <Paragraph>{selectedProject.description}</Paragraph>
          </Stack>
        )}
      </Modal>
    </Section>
  )
}
