import { useState, type FormEvent } from 'react'
import { Select } from '@base-ui/react/select'
import {
  IoArrowForwardOutline, IoChevronDownOutline, IoDocumentOutline,
  IoDocumentsOutline, IoCartOutline, IoGridOutline, IoHelpCircleOutline,
} from 'react-icons/io5'
import { apiClient } from '../../../../api/client'
import projectArtwork from '../../../../assets/images/contact-website-sketch.webp'
import { Section } from '../../../../components/Common'
import {
  Alert, Button, Card, Container, FormField, Grid, Heading,
  Input, Paragraph, Stack, Textarea,
} from '../../../../components/UI'
import { getTranslations, type Locale } from '../../../../i18n'

import './ContactSection.scss'

const websiteTypes = [
  { value: 'landing-page', icon: IoDocumentOutline },
  { value: 'multi-page-website', icon: IoDocumentsOutline },
  { value: 'online-store', icon: IoCartOutline },
  { value: 'catalog-website', icon: IoGridOutline },
  { value: 'undecided', icon: IoHelpCircleOutline },
] as const

export function ContactSection({ locale }: { locale: Locale }) {
  const { contact } = getTranslations(locale)
  const services = websiteTypes.map((type, index) => ({ ...type, label: contact.options[index] }))
  const [service, setService] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (submitting || !form.reportValidity()) return

    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      company: String(data.get('company') ?? ''),
      message: String(data.get('message') ?? ''),
      service: String(data.get('service') ?? ''),
      website: String(data.get('website') ?? ''),
      locale,
    }

    setSubmitting(true)
    setFormState('idle')
    try {
      await apiClient.post('/contact', payload, { signal: AbortSignal.timeout(15000) })
      form.reset()
      setService(null)
      setFormState('success')
    } catch {
      setFormState('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section id="contact" className="landing-section landing-contact" data-theme="dark">
      <Container size="2xl">
        <Stack gap="lg">
          <Stack gap="sm" className="landing-section__heading">
            <Heading level={2} accent={contact.titleAccent}>{contact.title}</Heading>
            <Paragraph className="landing-section__intro">{contact.intro}</Paragraph>
          </Stack>
          <Card variant="plain" padding="none" className="landing-contact__panel">
            <Grid columns="var(--contact-columns)" className="landing-contact__grid" gap="xl">
              <div className="landing-contact__artwork">
                <img src={projectArtwork} alt="" loading="lazy" />
              </div>

              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <Grid columns="var(--contact-fields)" className="landing-contact__fields" gap="md">
                    <FormField label={contact.name} htmlFor="contact-name" required>
                      <Input id="contact-name" name="name" autoComplete="name" placeholder={contact.namePlaceholder} required maxLength={100} />
                    </FormField>
                    <FormField label={contact.email} htmlFor="contact-email" required>
                      <Input id="contact-email" name="email" type="email" autoComplete="email" placeholder={contact.emailPlaceholder} required maxLength={254} />
                    </FormField>
                    <FormField label={contact.company} htmlFor="contact-company">
                      <Input id="contact-company" name="company" autoComplete="organization" placeholder={contact.companyPlaceholder} maxLength={140} />
                    </FormField>
                    <FormField label={contact.service} htmlFor="contact-service" required>
                      <Select.Root name="service" items={services} value={service} onValueChange={setService} required modal={false}>
                        <Select.Trigger id="contact-service" className="ui-select contact-service-trigger">
                          <Select.Value className="contact-service-trigger__value" placeholder={contact.choose} />
                          <Select.Icon><IoChevronDownOutline /></Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Positioner
                            data-theme="dark"
                            className="contact-service-positioner"
                            side="bottom"
                            align="end"
                            sideOffset={6}
                            alignItemWithTrigger={false}
                            collisionAvoidance={{ side: 'none', align: 'shift', fallbackAxisSide: 'none' }}
                          >
                            <Select.Popup className="contact-service-popup">
                              <Select.List>
                                {services.map(({ label, value, icon: ServiceIcon }) => {

                                  return (
                                    <Select.Item key={value} value={value} className="contact-service-option">
                                      <span className="contact-service-option__icon" aria-hidden="true"><ServiceIcon /></span>
                                      <Select.ItemText className="contact-service-option__label">{label}</Select.ItemText>
                                      <IoArrowForwardOutline className="contact-service-option__arrow" aria-hidden="true" />
                                    </Select.Item>
                                  )
                                })}
                              </Select.List>
                            </Select.Popup>
                          </Select.Positioner>
                        </Select.Portal>
                      </Select.Root>
                    </FormField>
                  </Grid>

                  <FormField label={contact.message} htmlFor="contact-message" required>
                    <Textarea id="contact-message" name="message" placeholder={contact.messagePlaceholder} required minLength={20} maxLength={3000} rows={4} />
                  </FormField>

                  <label className="contact-honeypot" aria-hidden="true">
                    Website
                    <Input name="website" tabIndex={-1} autoComplete="off" />
                  </label>

                  <Paragraph size="xs" color="secondary">
                    {contact.privacyNotice}
                  </Paragraph>

                  <Stack gap="sm" align="start">
                    <Button type="submit" loading={submitting}>
                      {submitting ? contact.sending : contact.submit}
                    </Button>
                  </Stack>

                  {formState !== 'idle' && <Alert variant={formState}>{contact[formState]}</Alert>}
                </Stack>
              </form>
            </Grid>
          </Card>
        </Stack>
      </Container>
    </Section>
  )
}
