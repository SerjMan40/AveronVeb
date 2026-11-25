const sourceLines = [
  `import { catalog } from './studio'

const projects = catalog
  .filter(project => project.published)
  .map(({ slug, title, cover }) => ({
    id: slug,
    title,
    image: cover,
  }))

const index = new Map(
  projects.map(project => [project.id, { ...project, visible: true, source: 'portfolio' }])
)

export const findProject = id => index.get(id)`,
  `const slides = projects.map(buildSlide)
const carousel = createCarousel(slides, {
  direction: 'horizontal',
  slidesPerView: 1,
  speed: 420,
})

carousel.on('slideChange', ({ activeIndex }) => {
  const project = slides[activeIndex]
  updateCaption(project.title)
  updateCounter({ current: activeIndex + 1, total: slides.length, label: project.title })
})

carousel.mount('#work')`,
  `function buildSlide(project) {
  const element = document.createElement('article')
  const heading = document.createElement('h3')
  const preview = document.createElement('img')

  heading.textContent = project.title
  preview.src = project.image
  preview.alt = project.title
  preview.loading = 'lazy'
  element.append(preview, heading, createProjectCaption(project.category, project.summary))

  return { ...project, element }
}`,
  `const cache = new Map()

async function loadCaseStudy(slug) {
  if (cache.has(slug)) return cache.get(slug)

  const response = await fetch(
    \`/portfolio/\${encodeURIComponent(slug)}.json\`
  )
  if (!response.ok) throw new Error('Project unavailable: ' + response.status + ' ' + response.statusText)

  const project = await response.json()
  cache.set(slug, project)
  return project
}`,
].join('\n').split('\n').filter(line => line.trim().length >= 14)

export const portfolioCode = sourceLines.map((line, index) => [
  line,
  sourceLines[(index + 11) % sourceLines.length],
  sourceLines[(index + 23) % sourceLines.length],
].join('    ')).join('\n')
