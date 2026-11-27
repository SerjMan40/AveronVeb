import type { Dictionary } from '../types'

export const en = {
  nav: { home: 'Home', services: 'Services', work: 'Gallery', process: 'Process', contact: 'Discuss your project' },
  layout: {
    language: 'Language', openMenu: 'Open menu', closeMenu: 'Close menu',
    skip: 'Skip to content', backToTop: 'Back to top',
  },
  metadata: {
    title: 'AVERON WEB ? Websites built to grow with your business',
    description: 'Build, launch and evolve professional business websites with monthly development, ongoing care and an optional buyout.',
    privacyDescription: 'Information about inquiry and personal data handling by AVERON WEB.',
    termsDescription: 'Service and material use terms for AVERON WEB.',
  },
  hero: {
    eyebrow: 'Web design & development',
    title: 'Your ideas, thoughtfully built for the', titleAccent: 'digital world.',
    description: 'Modern websites with clear structure, expressive design and intuitive controls.',
    primary: 'Discuss your project',
    visualLabel: 'Your business, online',
  },
  services: {
    title: 'Everything a', titleAccent: 'modern website needs.', intro: 'From the first structure to continuous improvement, we help your business show up online.',
    items: [
      ['Website development', 'We plan the structure and build a responsive website around your goals. It’s easy to use on screens from smartphones to widescreen monitors.'],
      ['Web design', 'We turn your brand and audience needs into a cohesive interface with clear navigation and thoughtful interaction patterns.'],
      ['SEO & optimization', 'We improve loading speed, technical structure and metadata so your website is ready for indexing and long-term search growth.'],
      ['Website maintenance', 'We handle updates, backups, security and availability for your website.'],
      ['Website improvement', 'We add features, refresh pages and remove friction as your product evolves and your business priorities change.'],
    ],
  },
  work: {
    previous: 'Previous project', next: 'Next project',
    luminaDescription: 'A modern website for a beauty salon with online booking and service management.', viewProject: 'View project', upcoming: 'Project coming soon',
    title: 'Project Gallery',
    concept: 'Demo · concept', open: 'Explore concept', close: 'Close preview', conceptLabel: 'Concept work — not a client project',
    projects: [
      { name: 'A slower kind of stay', category: 'Hospitality', description: 'A website concept for a countryside retreat, shaped around atmosphere and booking.', kind: 'stay' },
      { name: 'Expertise, made clear', category: 'Professional services', description: 'A corporate website concept that explains services and makes starting a conversation easy.', kind: 'studio' },
      { name: 'Everyday essentials', category: 'E-commerce', description: 'A storefront concept with clear navigation and a product-first presentation.', kind: 'shop' },
    ],
  },
  process: {
    title: 'How we', titleAccent: 'work.', intro: 'From the first conversation to launch and ongoing improvements.',
    steps: [
      'Understand the project',
      'Plan the structure and design',
      'Build and test',
      'Launch the site',
      'Maintain and improve',
    ],
  },
  contact: {
    title: 'Tell us about', titleAccent: 'your idea.', intro: 'We’ll help you plan and build a website for your business.',
    name: 'Your name', email: 'Email address', company: 'Company name', message: 'A little about your project', service: 'What are you interested in?', choose: 'Choose a website type',
    options: ['Landing page', 'Multi-page website', 'Online store', 'Catalog website', 'Not sure yet'],
    privacyNotice: 'We use your information to respond to your inquiry.', privacy: 'Privacy Policy', submit: 'Start your project', sending: 'Sending…', success: 'Thank you — your message has been sent.', error: 'Your message could not be sent. Please try again later.',
    namePlaceholder: 'How should we address you?', emailPlaceholder: 'you@company.com', companyPlaceholder: 'Optional', messagePlaceholder: 'Tell us more about what you want the website to achieve. What should it help you do?',
  },
  footer: { navigation: 'Explore', contact: 'Contact', privacy: 'Privacy policy', terms: 'Terms of use', rights: 'All rights reserved.' },
  legal: {
    privacyTitle: 'Privacy policy', termsTitle: 'Terms of use', back: 'Back to home', draft: 'Publication details to complete: add the data controller’s legal name, official contact details and confirmed retention periods before launch.',
    privacy: 'The inquiry form collects your name and email address, and your project description and selected website type, plus your company name if provided. This information is used to respond to your request. Once configured, the server will send the inquiry to a destination chosen by the site owner, such as an email address or inquiry management system. Please do not include sensitive information in the form.',
    terms: 'This website describes services that AVERON WEB may provide. Service scope, monthly fees, timing, maintenance, website buyout and transfer of rights are agreed in a separate contract before work starts. Use of specific projects and third-party materials remains subject to their respective rights holders.',
  },
} as const satisfies Dictionary
