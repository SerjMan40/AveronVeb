/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AVERON_SITE_URL: string
  readonly VITE_PUBLIC_CONTACT_EMAIL?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
