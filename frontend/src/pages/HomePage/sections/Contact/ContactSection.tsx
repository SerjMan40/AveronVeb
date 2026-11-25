import { useState, type FormEvent } from 'react'
import { apiClient } from '../../../../api/client'
import { Section } from '../../../../components/Common'
import {
  Alert, Button, Card, Checkbox, Container, Flex, FormField, Grid, Heading,
  Input, Link, Paragraph, Select, Stack, Text, Textarea,
} from '../../../../components/UI'
import { siteContent, type Locale } from '../../../../i18n/content'

import './ContactSection.scss'

export function ContactSection({ locale }: { locale: Locale }) {
  const { contact } = siteContent[locale]
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
      consent: data.get('consent') === 'on',
      website: String(data.get('website') ?? ''),
      locale,
    }

    setSubmitting(true)
    setFormState('idle')
    try {
      await apiClient.post('/contact', payload, { signal: AbortSignal.timeout(15000) })
      form.reset()
      setFormState('success')
    } catch {
      setFormState('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section id="contact" className="landing-section landing-section--light" data-theme="light">
      <Container size="2xl">
        <Stack gap="lg">
          <Stack gap="sm" className="landing-section__heading">
              <Heading level={2} accent={contact.titleAccent}>{contact.title}</Heading>
            <Paragraph className="landing-section__intro">{contact.intro}</Paragraph>
          </Stack>
          <Card padding="none" className="landing-contact__panel" data-theme="dark">
            <Grid columns="var(--contact-columns)" className="landing-contact__grid" gap="xl" align="start">
              <Stack gap="md">
                <Text weight="bold">AVERON WEB</Text>
                <Text italic>Build. Launch. Evolve.</Text>
              </Stack>

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
                      <Select id="contact-service" name="service" required defaultValue="">
                        <option value="" disabled>{contact.choose}</option>
                        {contact.options.map((option, index) => (
                          <option value={`service_${index + 1}`} key={option}>{option}</option>
                        ))}
                      </Select>
                    </FormField>
                  </Grid>

                  <FormField label={contact.message} htmlFor="contact-message" required>
                    <Textarea id="contact-message" name="message" placeholder={contact.messagePlaceholder} required minLength={20} maxLength={3000} rows={4} />
                  </FormField>

                  <label className="contact-honeypot" aria-hidden="true">
                    Website
                    <Input name="website" tabIndex={-1} autoComplete="off" />
                  </label>

                  <Flex gap="xs" wrap="wrap" align="center">
                    <Checkbox name="consent" label={contact.consent} aria-describedby="contact-privacy" required />
                    <Link href={`/${locale}/privacy`} id="contact-privacy">{contact.privacy}</Link>
                  </Flex>

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
