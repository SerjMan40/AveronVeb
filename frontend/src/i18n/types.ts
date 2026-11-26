type Labels<Keys extends string> = Readonly<Record<Keys, string>>

export interface ProjectTranslation {
  readonly name: string
  readonly category: string
  readonly description: string
  readonly kind: 'stay' | 'studio' | 'shop'
}

export interface Dictionary {
  readonly nav: Labels<'home' | 'services' | 'work' | 'process' | 'contact'>
  readonly layout: Labels<'language' | 'openMenu' | 'closeMenu' | 'skip' | 'backToTop'>
  readonly metadata: Labels<'title' | 'description' | 'privacyDescription' | 'termsDescription'>
  readonly hero: Labels<'eyebrow' | 'title' | 'titleAccent' | 'description' | 'primary' | 'visualLabel'>
  readonly services: Labels<'title' | 'titleAccent' | 'intro'> & {
    readonly items: readonly (readonly [name: string, description: string])[]
  }
  readonly work: Labels<
    'title' | 'concept' | 'open' | 'close' | 'conceptLabel' | 'previous' | 'next' | 'luminaDescription' | 'viewProject' | 'upcoming'
  > & {
    readonly projects: readonly ProjectTranslation[]
  }
  readonly process: Labels<'title' | 'titleAccent' | 'intro'> & {
    readonly steps: readonly string[]
  }
  readonly contact: Labels<
    | 'title' | 'titleAccent' | 'intro' | 'name' | 'email' | 'company' | 'message' | 'service' | 'choose'
    | 'privacyNotice' | 'privacy' | 'submit' | 'sending' | 'success' | 'error'
    | 'namePlaceholder' | 'emailPlaceholder' | 'companyPlaceholder' | 'messagePlaceholder'
  > & {
    readonly options: readonly [string, string, string, string, string]
  }
  readonly footer: Labels<'navigation' | 'contact' | 'privacy' | 'terms' | 'rights'>
  readonly legal: Labels<'privacyTitle' | 'termsTitle' | 'back' | 'draft' | 'privacy' | 'terms'>
}
