import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  company: z.string().trim().max(140).optional().default(''),
  message: z.string().trim().min(20).max(3000),
  service: z.enum(['service_1', 'service_2', 'service_3', 'service_4', 'service_5']),
  website: z.string().max(300).optional().default(''),
  locale: z.enum(['uk', 'en', 'ru']),
})

export type ContactSubmission = z.infer<typeof contactSchema>
