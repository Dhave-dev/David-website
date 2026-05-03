import { sanityFetch, imageUrl } from './sanity.js'

/* ─── Projects on homepage ───────────────────────────────────── */
async function loadProjects() {
  const grid = document.getElementById('worksCarousel')
  if (!grid) return

  let projects
  try {
    projects = await sanityFetch(
      `*[_type == "project"] | order(order asc) [0...6] {
        _id, title, slug, category, coverImage
      }`
    )
  } catch (e) {
    console.error('CMS fetch failed:', e)
    grid.innerHTML = ''
    return
  }

  if (!projects?.length) {
    grid.innerHTML = ''
    return
  }

  grid.innerHTML = projects.map(p => `
    <a href="project.html?slug=${p.slug.current}" class="project-card reveal">
      <div class="project-card__image">
        <img src="${imageUrl(p.coverImage, 800)}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="project-card__info">
        <div class="project-card__title">${p.title}</div>
        <div class="project-card__category">${p.category}</div>
      </div>
    </a>
  `).join('')

  // re-run reveal observer on new elements
  if (window.__revealObserver) {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * 60 + 'ms'
      window.__revealObserver.observe(el)
    })
  }
}

/* ─── Filter tabs ────────────────────────────────────────────── */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')

      const filter = tab.dataset.filter
      document.querySelectorAll('#worksCarousel .project-card').forEach(card => {
        const match = !filter || filter === 'all' || card.dataset.filter === filter
        card.style.display = match ? '' : 'none'
      })
    })
  })
}

/* ─── Testimonials ───────────────────────────────────────────── */
async function loadTestimonials() {
  const track = document.querySelector('.testimonials-track')
  if (!track) return

  const items = await sanityFetch(
    `*[_type == "testimonial"] | order(order asc) {
      _id, text, authorName, authorAvatar
    }`
  )

  if (!items?.length) return

  const doubled = [...items, ...items]
  track.innerHTML = doubled.map(t => `
    <div class="testimonial-card">
      <p class="testimonial-card__text">"${t.text}"</p>
      <div class="testimonial-card__author">
        <div class="testimonial-card__avatar">
          ${t.authorAvatar
            ? `<img src="${imageUrl(t.authorAvatar, 80)}" alt="${t.authorName}" />`
            : `<div style="width:40px;height:40px;border-radius:50%;background:#2a2a2c;"></div>`
          }
        </div>
        <span class="testimonial-card__name">${t.authorName}</span>
      </div>
    </div>
  `).join('')
}

/* ─── Brand logos ────────────────────────────────────────────── */
async function loadBrandLogos() {
  const track = document.querySelector('.brand-logos__track')
  if (!track) return

  const logos = await sanityFetch(
    `*[_type == "brandLogo"] | order(order asc) { _id, name, logo }`
  )

  if (!logos?.length) return

  const doubled = [...logos, ...logos]
  track.innerHTML = doubled.map(l => `
    <div class="brand-logo-item">
      ${l.logo
        ? `<img src="${imageUrl(l.logo, 120)}" alt="${l.name}" class="brand-logo-item__img" />`
        : `<span class="brand-logo-item__name">${l.name}</span>`
      }
    </div>
  `).join('')
}

/* ─── Site settings (hero, avatar) ──────────────────────────── */
async function loadSiteSettings() {
  const settings = await sanityFetch(
    `*[_type == "siteSettings"][0] {
      heroHeadingLine1, heroHeadingLine2, heroSubtitle,
      availableForWork, availableBadgeText,
      email, behanceUrl, linkedinUrl, instagramUrl, avatarImage
    }`
  )
  if (!settings) return

  const line1 = document.querySelector('.hero__heading-line1')
  const line2 = document.querySelector('.hero__heading-line2')
  const sub   = document.querySelector('.hero__subtitle')
  if (line1 && settings.heroHeadingLine1) line1.textContent = settings.heroHeadingLine1
  if (line2 && settings.heroHeadingLine2) line2.textContent = settings.heroHeadingLine2
  if (sub  && settings.heroSubtitle)      sub.textContent   = settings.heroSubtitle

  // Avatar
  if (settings.avatarImage) {
    const avatar = document.querySelector('.topbar__avatar img')
    if (avatar) avatar.src = imageUrl(settings.avatarImage, 96)
  }

  // Social links
  if (settings.behanceUrl) {
    document.querySelectorAll('[aria-label="Behance"]').forEach(a => a.href = settings.behanceUrl)
  }
  if (settings.linkedinUrl) {
    document.querySelectorAll('[aria-label="LinkedIn"]').forEach(a => a.href = settings.linkedinUrl)
  }
  if (settings.instagramUrl) {
    document.querySelectorAll('[aria-label="Instagram"]').forEach(a => a.href = settings.instagramUrl)
  }
  if (settings.email) {
    document.querySelectorAll('[aria-label="Contact"]').forEach(a => {
      a.href = `mailto:${settings.email}`
    })
  }

  // Available badge
  const badge = document.querySelector('.available-badge')
  if (badge && settings.availableForWork === false) {
    badge.style.display = 'none'
  } else if (badge && settings.availableBadgeText) {
    const label = badge.querySelector('span:last-child') || badge
    if (label !== badge) label.textContent = settings.availableBadgeText
  }
}

/* ─── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadSiteSettings()
  loadProjects()
  loadTestimonials()
  loadBrandLogos()
  initFilterTabs()
})
