type Labels<Keys extends string> = Readonly<Record<Keys, string>>

export interface Dictionary {
  readonly nav: Labels<'home' | 'services' | 'work' | 'process' | 'contact'>
  readonly layout: Labels<'language' | 'openMenu' | 'closeMenu' | 'skip' | 'backToTop'>
  readonly metadata: Labels<'title' | 'description'>
  readonly hero: Labels<'eyebrow' | 'title' | 'titleAccent' | 'description' | 'primary' | 'visualLabel'>
  readonly services: Labels<'title' | 'titleAccent' | 'intro'> & {
    readonly items: readonly (readonly [name: string, description: string])[]
  }
  readonly work: Labels<
    'title' | 'previous' | 'next' | 'luminaDescription' | 'viewProject'
  >
  readonly process: Labels<'title' | 'titleAccent' | 'intro'> & {
    readonly steps: readonly string[]
  }
  readonly contact: Labels<
    | 'title' | 'titleAccent' | 'intro' | 'name' | 'email' | 'company' | 'message' | 'service' | 'choose'
    | 'privacyNotice' | 'submit' | 'sending' | 'success' | 'error' | 'invalid' | 'rateLimited'
    | 'namePlaceholder' | 'emailPlaceholder' | 'companyPlaceholder' | 'messagePlaceholder'
  > & {
    readonly options: readonly [string, string, string, string, string]
  }
  readonly footer: Labels<'navigation' | 'contact' | 'rights'>
}
