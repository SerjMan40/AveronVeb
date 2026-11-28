# AVERON WEB

International web development studio website. The frontend uses React, TypeScript, Vite and Sass. The API uses Express, Mongoose and MongoDB. Resend delivers inquiry notifications.

## Local development

Use Node.js 24 and Yarn Classic. From the repository root, run `npm install` to install dependencies, then `npm run dev`. Vite serves http://localhost:5173 and proxies `/api` to port 4000.

Set `MONGODB_URI` in the local `backend/.env` to point at a MongoDB database. Without it, the site can run locally but the API returns 503 for valid inquiries. For a local end-to-end setup with MongoDB and Nginx, run `docker compose up --build` and open http://localhost:8080. Compose credentials are for local use.

Set `RESEND_API_KEY`, `INQUIRY_MAIL_FROM` and `INQUIRY_MAIL_TO` together to enable notifications. Local development can store inquiries without sending mail. Use a verified sending domain and a sending-only API key.

## Inquiry API and notifications

- `POST /api/inquiries` accepts JSON with `name`, `email`, `company` (optional), `message`, `service`, `locale` and the optional empty honeypot field `website`. The previous `/api/contact` path is an alias for existing clients.
- `202 {"ok":true}` means an inquiry was accepted for processing. Repeated identical submissions and honeypot hits get the same response. The unique MongoDB index deduplicates by normalized email, name, company, brief and service until the stored record expires.
- Error responses use `{"error":{"code":"…","message":"…"}}`. Validation responses include field names and codes. CORS accepts configured origins, the endpoint accepts up to 24 KB of uncompressed JSON, and each backend instance limits each client IP to six submission attempts in 15 minutes.
- Each saved inquiry includes a notification state. A worker leases queued notifications in MongoDB. Timeouts, rate limits and temporary provider failures are retried with a stable Resend idempotency key. Terminal failures remain visible in `notification.status` for review. A `sent` state records acceptance by Resend. Verify delivery or bounces in the provider dashboard.
- `GET /api/health` reports MongoDB readiness. Logs omit request bodies, client details and provider payloads.

### Telegram setup

1. Open [@BotFather](https://t.me/BotFather), run `/newbot`, and store the token privately. Open the new bot and press **Start**, or add it to a private group and send it a command such as `/start@your_bot_username`. [Telegram bot tutorial](https://core.telegram.org/bots/tutorial)
2. Obtain the numeric chat ID from `message.chat.id` returned by the bot's `getUpdates` method. With the token already saved in `backend/.env`, run the following from `backend` to print only chat IDs. `getUpdates` requires that the bot does not have a webhook configured. [Telegram getUpdates](https://core.telegram.org/bots/api#getupdates)

   ```sh
   node --env-file=.env --input-type=module -e "const r = await fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/getUpdates', { redirect: 'error' }).catch(() => null); const body = await r?.json().catch(() => null); if (body?.ok !== true) { console.error('Telegram getUpdates failed'); process.exit(1) } for (const u of body.result) if (u.message?.chat?.id != null) console.log(u.message.chat.id)"
   ```

3. Set `TELEGRAM_CHAT_ID` to the ID, including the minus sign for a group, and restart the API. Set the same pair of variables on Render for production. Email settings are optional and independent.
4. Submit a test inquiry using fictional details. Only new inquiries saved while Telegram is configured are queued. The Telegram delivery state is stored in `telegramNotification` in the same inquiry document. A retry after an ambiguous response may deliver a duplicate bearing the same inquiry ID.

## Retention

MongoDB expires inquiry records 90 days after submission by default. Set `INQUIRY_RETENTION_DAYS` to change retention for new records. For an early deletion request, authorized operators should delete the record from the inquiry collection and remove related copies from the notification mailbox and any exported data. Apply the corresponding retention rules to backups, mailbox storage and the private Telegram chat separately. Limit MongoDB and mailbox access to staff handling inquiries.

## Production

1. Create or select a MongoDB Atlas project and cluster. Create a dedicated application database user with `readWrite` on the inquiry database, and allow connections from the selected Render service's outbound addresses. [Atlas connection setup](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)
2. Verify the sender domain in Resend and create a sending key. Set the from and recipient addresses when configuring Render. [Resend email API](https://resend.com/docs/api-reference/emails/send-email)
3. Deploy the repository with the Render Blueprint in `render.yaml`. Set `MONGODB_URI`, the HTTPS frontend origins in `CLIENT_ORIGIN` (comma-separated, with no trailing slash), and the settings for each notification channel you want to enable. Use an always-running instance if retries must proceed during periods without traffic. Confirm the trusted proxy hop count for the service. [Render Blueprint reference](https://render.com/docs/blueprint-spec)
4. On Vercel, select `frontend` as the project root and Node.js 24. Set `VITE_API_BASE_URL` to the Render HTTPS URL including `/api`, and set `AVERON_SITE_URL` to the canonical frontend HTTPS origin for the sitemap. Optional public contact details are listed in `frontend/.env.example`. [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
5. Check HTTPS, `/api/health`, language routes, and a test form submission. Confirm the resulting database row, receipt in the notification mailbox and the client's address in Reply-To.

Run `npm run build` to compile both applications. Run `yarn --cwd backend test` for API smoke tests. Set `INQUIRY_TEST_MONGODB_URI` to a local loopback MongoDB URI to additionally exercise persistence, duplicate requests and notification retries in a disposable database.
