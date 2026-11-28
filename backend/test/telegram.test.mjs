import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {test} from 'node:test'
import {sendTelegramMessage} from '../dist/integrations/telegram/index.js'

test('Telegram transport sends plain text and classifies delivery outcomes', async ({mock}) => {
  const token = '123456:fake_test_token'
  const message = {chatId: -1001234567890, text: '<b>customer text</b>', protectContent: true}
  mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, `https://api.telegram.org/bot${token}/sendMessage`)
    assert.equal(options.redirect, 'error')
    assert.ok(options.signal instanceof AbortSignal)
    return Response.json({ok: true, result: {message_id: 42}})
  })

  assert.deepEqual(await sendTelegramMessage(token, message), {status: 'sent'})
  assert.deepEqual(JSON.parse(fetch.mock.calls[0].arguments[1].body), {
    chat_id: message.chatId,
    text: message.text,
    protect_content: true,
    link_preview_options: {is_disabled: true},
  })

  fetch.mock.mockImplementation(async () =>
    Response.json({
      ok: false,
      error_code: 429,
      parameters: {retry_after: 90},
    }),
  )
  assert.deepEqual(await sendTelegramMessage(token, message), {
    status: 'retry',
    code: 429,
    retryAfterSeconds: 90,
  })

  fetch.mock.mockImplementation(async () => new Response(null, {status: 503}))
  assert.equal((await sendTelegramMessage(token, message)).status, 'retry')

  fetch.mock.mockImplementation(async () => new Response(null, {status: 403}))
  assert.deepEqual(await sendTelegramMessage(token, message), {status: 'failed', code: 403})

  fetch.mock.mockImplementation(async () => {
    throw new Error('Network error')
  })
  assert.deepEqual(await sendTelegramMessage(token, message), {status: 'retry'})
})

test('production environment supports Telegram independently of Email', () => {
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    MONGODB_URI: 'mongodb://127.0.0.1:27017/averon',
    CLIENT_ORIGIN: 'https://frontend.example',
    TELEGRAM_BOT_TOKEN: '123456:fake_test_token',
    TELEGRAM_CHAT_ID: '-1001234567890',
    RESEND_API_KEY: '',
    INQUIRY_MAIL_FROM: '',
    INQUIRY_MAIL_TO: '',
  }
  const script = 'import("./dist/config/env.js")'
  assert.equal(spawnSync(process.execPath, ['-e', script], {env}).status, 0)

  const partial = spawnSync(process.execPath, ['-e', script], {
    env: {...env, TELEGRAM_CHAT_ID: ''},
    encoding: 'utf8',
  })
  assert.equal(partial.status, 1)
  assert.match(partial.stderr, /TELEGRAM_CHAT_ID/)
  assert.doesNotMatch(partial.stderr, /fake_test_token/)
})
