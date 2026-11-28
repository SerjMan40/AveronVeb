import type { RequestHandler } from 'express'
import type { InquirySubmission } from './inquiry.schema.js'
import { saveInquiry } from './inquiry.service.js'

export const createInquiry: RequestHandler = async (request, response) => {
  await saveInquiry(request.body as InquirySubmission)
  response.status(202).json({ ok: true })
}
