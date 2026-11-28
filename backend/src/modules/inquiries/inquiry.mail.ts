import { env } from '../../config/env.js'

export const mailConfigured = Boolean(env.RESEND_API_KEY && env.INQUIRY_MAIL_FROM && env.INQUIRY_MAIL_TO)

const entities: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => entities[char])

interface InquiryMail {
  id: string
  name: string
  email: string
  company: string
  service: string
  locale: string
  message: string
  createdAt: Date
}

const services: Record<string, string> = {
  'landing-page': 'Landing page',
  'multi-page-website': 'Multi-page website',
  'online-store': 'Online store',
  'catalog-website': 'Catalog website',
  undecided: 'Not sure yet',
  service_1: 'Website development',
  service_2: 'Web design',
  service_3: 'Website maintenance',
  service_4: 'SEO & optimization',
  service_5: 'Website improvement',
}

export async function sendInquiryMail(inquiry: InquiryMail): Promise<'sent' | 'retry' | 'failed'> {
  const fields = [
    ['Name', inquiry.name],
    ['Email', inquiry.email],
    ['Company', inquiry.company || '—'],
    ['Project', services[inquiry.service] ?? inquiry.service],
    ['Language', inquiry.locale],
    ['Received (UTC)', inquiry.createdAt.toISOString()],
  ]
  const rows = fields.map(([label, value]) =>
    `<tr><th scope="row" style="text-align:left;padding:6px 14px 6px 0">${label}</th><td>${escapeHtml(value)}</td></tr>`,
  ).join('')
  const html = `<!doctype html>
<html lang="en"><body style="margin:0;background:#101629;color:#f4f6ff;font:16px Arial,sans-serif">
<div style="max-width:620px;margin:auto;padding:32px">
  <p style="color:#a5b4fc;font-weight:bold;letter-spacing:.12em">AVERON WEB</p>
  <h1 style="font-size:26px">New project inquiry</h1>
  <table style="color:#f4f6ff">${rows}</table>
  <h2 style="font-size:20px">Project brief</h2>
  <p style="padding:16px;background:#18213a;overflow-wrap:anywhere">${escapeHtml(inquiry.message).replace(/\r?\n/g, '<br>')}</p>
  <p style="color:#b0b8ce">Reply to this email to contact the client.</p>
</div></body></html>`
  const text = [...fields.map(([label, value]) => `${label}: ${value}`), '', inquiry.message].join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `inquiry/${inquiry.id}`,
      },
      body: JSON.stringify({
        from: `Averon Web <${env.INQUIRY_MAIL_FROM}>`,
        to: [env.INQUIRY_MAIL_TO],
        reply_to: inquiry.email,
        subject: 'New project inquiry | Averon Web',
        html,
        text,
      }),
    })
    await response.body?.cancel()
    if (response.ok) return 'sent'
    return response.status === 409 || response.status === 429 || response.status >= 500
      ? 'retry'
      : 'failed'
  } catch {
    return 'retry'
  }
}
