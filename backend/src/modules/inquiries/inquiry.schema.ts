import { z } from 'zod'

export const inquirySchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().pipe(z.email().max(254)),
  company: z.string().trim().max(140).default(''),
  message: z.string().trim().min(20).max(3000),
  service: z.enum([
    'service_1', 'service_2', 'service_3', 'service_4', 'service_5',
    'landing-page', 'multi-page-website', 'online-store', 'catalog-website', 'undecided',
  ]),
  website: z.string().max(300).default(''),
  locale: z.enum(['uk', 'en', 'ru']),
})

export type InquirySubmission = z.infer<typeof inquirySchema>
