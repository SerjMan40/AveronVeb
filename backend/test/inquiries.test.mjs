import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'
import { test } from 'node:test'
import mongoose from 'mongoose'

process.env.NODE_ENV = 'test'
process.env.MONGODB_URI = ''
process.env.CLIENT_ORIGIN = 'https://frontend.example'
process.env.TRUST_PROXY_HOPS = '0'
process.env.RESEND_API_KEY = 'test-key'
process.env.INQUIRY_MAIL_FROM = 'from@example.com'
process.env.INQUIRY_MAIL_TO = 'to@example.com'
process.env.TELEGRAM_BOT_TOKEN = '123456:fake_test_token'
process.env.TELEGRAM_CHAT_ID = '-1001234567890'

const { createApp } = await import('../dist/app.js')
const { Inquiry } = await import('../dist/modules/inquiries/inquiry.model.js')
const { startInquiryWorker } = await import('../dist/modules/inquiries/inquiry.worker.js')

const sample = {
  name: 'Test & <client>',
  email: 'client@example.com',
  company: 'Test company',
  service: 'landing-page',
  locale: 'uk',
  message: 'A project brief for a test inquiry. <script>alert(1)</script>',
}

async function withApi(run) {
  const server = createApp().listen(0, '127.0.0.1')
  await once(server, 'listening')
  const base = `http://127.0.0.1:${server.address().port}/api`
  const request = (path, options) => fetch(base + path, options)
  const post = (body, headers) => request('/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  try {
    await run({ request, post })
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
}

async function expectError(response, status, code) {
  assert.equal(response.status, status)
  assert.equal((await response.json()).error.code, code)
}

test('HTTP validation, CORS, request limits and missing storage', async () => {
  await withApi(async ({ request, post }) => {
    const health = await request('/health', { headers: { Origin: 'https://frontend.example' } })
    assert.equal(health.status, 200)
    assert.equal(health.headers.get('access-control-allow-origin'), 'https://frontend.example')
    assert.equal(health.headers.get('x-content-type-options'), 'nosniff')
    await expectError(await post(sample, { Origin: 'https://other.example' }), 403, 'ORIGIN_NOT_ALLOWED')
    await expectError(await post(sample, { 'Content-Type': 'text/plain' }), 415, 'UNSUPPORTED_MEDIA_TYPE')
    await expectError(await post('{'), 400, 'INVALID_JSON')
    await expectError(await post({ ...sample, message: 'x'.repeat(26_000) }), 413, 'REQUEST_TOO_LARGE')
    await expectError(await post({ ...sample, email: 'invalid' }), 400, 'VALIDATION_ERROR')
    const spam = await post({ ...sample, website: 'https://bot.example' })
    assert.equal(spam.status, 202)
    assert.deepEqual(await spam.json(), { ok: true })
    await expectError(await post(sample), 503, 'DATABASE_UNAVAILABLE')
    await expectError(await post(sample), 429, 'RATE_LIMITED')
    await expectError(await request('/missing'), 404, 'ROUTE_NOT_FOUND')
  })
})

const mongoUri = process.env.INQUIRY_TEST_MONGODB_URI

async function eventually(check) {
  const deadline = Date.now() + 8000
  while (Date.now() < deadline) {
    const value = await check()
    if (value) return value
    await delay(50)
  }
  assert.fail('Expected MongoDB state was not reached')
}

test('MongoDB persistence, concurrent deduplication and notification retry', { skip: !mongoUri }, async () => {
  const uri = new URL(mongoUri)
  assert.equal(uri.protocol, 'mongodb:')
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(uri.hostname))
  const dbName = `averon_inquiry_test_${randomUUID().replaceAll('-', '')}`
  await mongoose.connect(mongoUri, { dbName, serverSelectionTimeoutMS: 5000 })
  const originalFetch = globalThis.fetch
  const mail = []
  const telegram = []
  let stopWorker
  try {
    await Inquiry.createIndexes()
    await withApi(async ({ post }) => {
      const responses = await Promise.all([
        post(sample), post({ ...sample, email: 'CLIENT@example.com', locale: 'en' }),
      ])
      for (const response of responses) {
        assert.equal(response.status, 202)
        assert.deepEqual(await response.json(), { ok: true })
      }
      assert.equal((await post({ ...sample, website: 'https://bot.example' })).status, 202)
    })
    assert.equal(await Inquiry.countDocuments(), 1)
    const stored = await Inquiry.findOne().orFail()
    assert.equal(stored.status, 'new')
    assert.ok(Math.abs(stored.expiresAt.getTime() - stored.createdAt.getTime() - 90 * 86_400_000) < 1000)
    assert.ok((await Inquiry.listIndexes()).some(index => index.expireAfterSeconds === 0))
    await Inquiry.collection.insertOne({
      ...sample,
      email: 'historical@example.com',
      expiresAt: stored.expiresAt,
      fingerprint: 'historical-inquiry',
      notification: { status: 'sent' },
    })
    globalThis.fetch = async (input, options) => {
      if (input === 'https://api.telegram.org/bot123456:fake_test_token/sendMessage') {
        telegram.push(JSON.parse(options.body))
        return Response.json(telegram.length === 1
          ? { ok: false, error_code: 429, parameters: { retry_after: 90 } }
          : { ok: true, result: { message_id: 42 } }, { status: telegram.length === 1 ? 429 : 200 })
      }
      assert.equal(input, 'https://api.resend.com/emails')
      mail.push({ headers: options.headers, body: JSON.parse(options.body) })
      return new Response(null, { status: mail.length === 1 ? 503 : 200 })
    }
    stopWorker = startInquiryWorker()
    await eventually(() => Inquiry.exists({
      'notification.status': 'pending',
      'notification.attempts': 1,
      'notification.nextAttemptAt': { $gt: new Date() },
    }))
    await eventually(() => Inquiry.exists({
      'telegramNotification.status': 'pending',
      'telegramNotification.attempts': 1,
      'telegramNotification.nextAttemptAt': { $gt: new Date(Date.now() + 65_000) },
    }))
    await stopWorker()
    await Inquiry.updateOne({ _id: stored._id }, { $set: { 'notification.nextAttemptAt': new Date(0) } })
    stopWorker = startInquiryWorker()
    await eventually(() => Inquiry.exists({ _id: stored._id, 'notification.status': 'sent' }))
    assert.equal(mail.length, 2)
    assert.equal(mail[0].headers['Idempotency-Key'], mail[1].headers['Idempotency-Key'])
    assert.equal(mail[1].body.reply_to, stored.email)
    assert.ok(mail[1].body.html.includes('&lt;script&gt;'))
    assert.ok(!mail[1].body.html.includes('<script>'))
    assert.equal(telegram.length, 1)
    assert.ok(await Inquiry.exists({ _id: stored._id, 'telegramNotification.status': 'pending' }))
    await stopWorker()
    await Inquiry.updateOne({ _id: stored._id }, { $set: { 'telegramNotification.nextAttemptAt': new Date(0) } })
    stopWorker = startInquiryWorker()
    await eventually(() => Inquiry.exists({ _id: stored._id, 'telegramNotification.status': 'sent' }))
    assert.equal(mail.length, 2)
    assert.equal(telegram.length, 2)
    assert.deepEqual(telegram[1], telegram[0])
    assert.equal(telegram[1].chat_id, -1001234567890)
    assert.equal(telegram[1].protect_content, true)
    assert.equal(telegram[1].link_preview_options.is_disabled, true)
    assert.equal(telegram[1].parse_mode, undefined)
    for (const field of ['name', 'email', 'company', 'service', 'locale', 'message']) {
      assert.ok(telegram[1].text.includes(stored[field]))
    }
    assert.ok(await Inquiry.exists({
      fingerprint: 'historical-inquiry', telegramNotification: { $exists: false },
    }))
  } finally {
    await stopWorker?.()
    globalThis.fetch = originalFetch
    try {
      assert.equal(mongoose.connection.name, dbName)
      await mongoose.connection.dropDatabase()
    } finally {
      await mongoose.disconnect()
    }
  }
})
