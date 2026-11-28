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
    luminaDescription: 'A modern website for a beauty salon with online booking and service management.', viewProject: 'View project',
    title: 'Project Gallery',
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
    invalid: 'Check your name, email, project type and brief. The brief must contain at least 20 characters.', rateLimited: 'Too many attempts. Please wait before trying again.',
    options: ['Landing page', 'Multi-page website', 'Online store', 'Catalog website', 'Not sure yet'],
    privacyNotice: 'We’ll use your contact details to respond to your inquiry.', submit: 'Start your project', sending: 'Sending…', success: 'Thank you! We’ve received your inquiry.', error: 'Your message could not be sent. Please try again later.',
    namePlaceholder: 'How should we address you?', emailPlaceholder: 'you@company.com', companyPlaceholder: 'Optional', messagePlaceholder: 'Tell us more about what you want the website to achieve. What should it help you do?',
  },
  footer: { navigation: 'Explore', contact: 'Contact', rights: 'All rights reserved.' },
} as const satisfies Dictionary
