import { sanityFetch, imageUrl } from './sanity.js'

/* ─── Site settings (bio, links, portrait) ───────────────────── */
async function loadAbout() {
  let settings
  try {
    settings = await sanityFetch(
      `*[_type == "siteSettings"][0] {
        aboutBio, availableForWork, availableBadgeText,
        behanceUrl, linkedinUrl, dribbbleUrl, email, cvUrl,
        portraitImage, avatarImage,
        "portraitRefs": heroImages[].asset._ref
      }`
    )
  } catch (e) {
    console.warn('About settings fetch failed:', e)
    return
  }
  if (!settings) return

  // Bio
  const bio = document.querySelector('.about-bio')
  if (bio && settings.aboutBio) bio.textContent = settings.aboutBio

  // Available badge
  const badge = document.querySelector('.available-badge')
  if (badge) {
    if (settings.availableForWork === false) {
      badge.style.display = 'none'
    } else if (settings.availableBadgeText) {
      const textNode = badge.lastChild
      if (textNode) textNode.textContent = ' ' + settings.availableBadgeText
    }
  }

  // Portrait main photo
  if (settings.portraitImage) {
    const portrait = document.getElementById('portraitPhoto')
    if (portrait) portrait.src = imageUrl(settings.portraitImage, 600)
  }

  // Portrait background scrolling images
  const refs = settings.portraitRefs?.filter(Boolean) || []
  if (refs.length) {
    const track = document.getElementById('portraitBgTrack')
    if (track) {
      const doubled = [...refs, ...refs]
      track.innerHTML = doubled.map(ref =>
        `<img src="${imageUrl({ _ref: ref }, 700)}" alt="" loading="lazy" />`
      ).join('')
    }
  }

  // Social links
  if (settings.behanceUrl)  document.querySelectorAll('[aria-label="Behance"]').forEach(a  => a.href = settings.behanceUrl)
  if (settings.linkedinUrl) document.querySelectorAll('[aria-label="LinkedIn"]').forEach(a => a.href = settings.linkedinUrl)
  if (settings.dribbbleUrl) document.querySelectorAll('[aria-label="Dribbble"]').forEach(a => a.href = settings.dribbbleUrl)

  // CV link
  if (settings.cvUrl) {
    const cvBtn = document.querySelector('.about-cv .btn')
    if (cvBtn) cvBtn.href = settings.cvUrl
  }

  // Email CTA
  if (settings.email) {
    const emailBtn = document.querySelector('.about-cta .btn-primary')
    if (emailBtn) emailBtn.href = `mailto:${settings.email}`
  }
}

/* ─── Work Experience ────────────────────────────────────────── */
async function loadExperience() {
  const container = document.getElementById('experienceList')
  if (!container) return

  let items
  try {
    items = await sanityFetch(
      `*[_type == "workExperience"] | order(order asc) {
        _id, company, location, role, type, startDate, endDate, logo
      }`
    )
  } catch (e) {
    console.warn('Experience fetch failed:', e)
    return
  }

  if (!items?.length) return

  container.innerHTML = items.map(item => {
    const dateStr = [item.startDate, item.endDate || 'Present'].filter(Boolean).join(' - ')
    const logoHtml = item.logo
      ? `<img src="${imageUrl(item.logo, 150)}" alt="${item.company}" />`
      : ''
    return `
      <div class="exp-item reveal">
        <div class="exp-item__icon">${logoHtml}</div>
        <div class="exp-item__details">
          <div class="exp-item__company">${item.company}${item.location ? ', ' + item.location : ''}</div>
          <div class="exp-item__role">${item.role}</div>
        </div>
        <div class="exp-item__date-info">
          <div class="exp-item__location">${item.type || ''}</div>
          <div class="exp-item__date">
            <span class="exp-item__date-label">Date: </span>
            <span class="exp-item__date-val">${dateStr}</span>
          </div>
        </div>
      </div>
      <div class="exp-item__sep"></div>
    `
  }).join('')

  if (window.__revealObserver) {
    container.querySelectorAll('.reveal').forEach(el => window.__revealObserver.observe(el))
  }
}

/* ─── My Stack ───────────────────────────────────────────────── */
async function loadStack() {
  const container = document.getElementById('stackRows')
  if (!container) return

  let items
  try {
    items = await sanityFetch(
      `*[_type == "stackItem"] | order(order asc) {
        _id, name, category, logo
      }`
    )
  } catch (e) {
    console.warn('Stack fetch failed:', e)
    return
  }

  if (!items?.length) return

  // Group into rows of 2
  const rows = []
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2))

  container.innerHTML = rows.map(row => `
    <div class="stack__row reveal">
      ${row.map(item => `
        <div class="stack-item">
          <div class="stack-item__top">
            <div class="stack-item__icon">
              <img src="${imageUrl(item.logo, 110)}" alt="${item.name}" loading="lazy" />
            </div>
            <span class="stack-item__name">${item.name}</span>
          </div>
          <div class="stack-item__sep"></div>
          <span class="stack-item__label">${item.category}</span>
        </div>
      `).join('')}
    </div>
  `).join('')

  if (window.__revealObserver) {
    container.querySelectorAll('.reveal').forEach(el => window.__revealObserver.observe(el))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAbout()
  loadExperience()
  loadStack()
})
