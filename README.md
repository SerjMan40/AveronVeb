# AVERON WEB

International web development studio website. The homepage has five content sections: hero, services, selected work, collaboration model and contact form.

## Stack

- Frontend: React, TypeScript, Vite and Sass.
- Backend: Express, TypeScript and MongoDB for the existing session infrastructure.
- Contact form: validated by the API and delivered to a configured webhook (email or lead-management integration).
- Docker: Compose runs MongoDB, the API and the built site served by Nginx.

## Local development

Requirements: Node.js 22+ and Yarn Classic. MongoDB is optional for local development; without it, the API uses temporary in-memory sessions. Production still requires MongoDB and persistent session storage.

1. Run `npm run install:all` from the project root.
2. Optionally copy `backend/.env.example` to `backend/.env` to enable MongoDB-backed sessions; set a private session secret before deployment.
3. Run `npm run dev`.

Vite runs at http://localhost:5173 and proxies `/api` to port 4000. The API health endpoint is http://localhost:4000/api/health. Open http://localhost:5173/ to select a language from the browser preference, or use `/uk`, `/en` and `/ru` directly.

### Contact delivery

Set `CONTACT_WEBHOOK_URL` in `backend/.env` to an HTTPS endpoint that accepts a JSON POST. Optionally set `CONTACT_WEBHOOK_TOKEN` for bearer-token authentication. The webhook receives the inquiry fields and language. If no destination is configured, the API returns a clear service-unavailable response and the form does not claim the inquiry was delivered.

Set `VITE_PUBLIC_CONTACT_EMAIL` in `frontend/.env` only after the studio's public email address is confirmed. It is displayed in the footer when configured.

Set `AVERON_SITE_URL` in `frontend/.env` to the confirmed HTTPS domain origin before a production build. The Vite build generates `robots.txt` and a localized `sitemap.xml` from this value. Without it, the build remains possible but only emits a basic robots file.

## Docker

Run `docker compose up --build` and visit http://localhost:8080. Set `CONTACT_WEBHOOK_URL` and optionally `CONTACT_WEBHOOK_TOKEN` in the root environment for contact delivery. The compose defaults are for local development; replace database credentials, session secrets, origin and domain settings before deployment.

## Build

Run `npm run build` to compile the backend and build the frontend.

## Notes before public launch

- Replace the temporary text mark with the supplied AVERON WEB logo asset when it is available in the project.
- Review the visual result against the approved homepage reference; the shared page was not accessible in the implementation environment.
- Add the confirmed legal entity, data-controller contacts and final privacy/terms text to the legal pages.
- Configure the contact webhook and confirmed public email address.
- Set the production domain and allowed `CLIENT_ORIGIN`, then verify canonical/hreflang URLs and submit the final sitemap to search tools.
- Add a verified social profile only if the studio creates one.

