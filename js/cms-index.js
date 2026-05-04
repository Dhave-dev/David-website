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
    console.error('CMS fetch failed — showing fallback cards:', e)
    return
  }

  if (!projects?.length) return

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
      _id, text, authorName, authorRole, authorAvatar
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
        <div>
          <span class="testimonial-card__name">${t.authorName}</span>
          ${t.authorRole ? `<span class="testimonial-card__role">${t.authorRole}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('')
}

/* ─── Brand logos ────────────────────────────────────────────── */
async function loadBrandLogos() {
  const track = document.querySelector('.brand-logos__track')
  if (!track) return

  let logos
  try {
    logos = await sanityFetch(
      `*[_type == "brandLogo"] | order(order asc) {
        _id, name, url,
        "logoRef": logo.asset._ref
      }`
    )
  } catch (e) {
    console.warn('Brand logos fetch failed:', e)
    return
  }

  if (!logos?.length) return

  // Duplicate for seamless scroll loop
  const doubled = [...logos, ...logos, ...logos]
  track.innerHTML = doubled.map(l => {
    const imgSrc = l.logoRef ? refToUrl(l.logoRef, 200) : null
    const inner = imgSrc
      ? `<img src="${imgSrc}" alt="${l.name}" class="brand-logo-item__img" loading="lazy" />`
      : `<span class="brand-logo-item__name">${l.name}</span>`
    return l.url
      ? `<a href="${l.url}" target="_blank" rel="noopener" class="brand-logo-item">${inner}</a>`
      : `<div class="brand-logo-item">${inner}</div>`
  }).join('')
}

/* ─── Expertise accordion ────────────────────────────────────── */
async function loadExpertise() {
  const accordion = document.querySelector('.expertise__accordion')
  if (!accordion) return

  const items = await sanityFetch(
    `*[_type == "expertise"] | order(order asc) {
      _id, title, description, previewImage
    }`
  )

  if (!items?.length) return

  const expertiseImg = document.querySelector('.expertise__image img')

  accordion.innerHTML = items.map((item, i) => {
    const imgSrc = item.previewImage ? imageUrl(item.previewImage, 900) : ''
    const isFirst = i === 0
    return `
      <li class="accordion-item${isFirst ? ' open' : ''} reveal"
          data-index="${i}"
          ${imgSrc ? `data-image="${imgSrc}"` : ''}>
        <div class="accordion-item__header">
          <span class="accordion-item__number-title">${item.title.toUpperCase()}</span>
          <button class="accordion-item__toggle"
                  aria-expanded="${isFirst ? 'true' : 'false'}"
                  aria-label="Toggle ${item.title}">
            <span class="accordion-item__icon"></span>
          </button>
        </div>
        <div class="accordion-item__divider"></div>
        <div class="accordion-item__body">
          <p class="accordion-item__text">${item.description || ''}</p>
          <div class="divider"></div>
        </div>
      </li>
    `
  }).join('')

  // Set initial preview image
  if (expertiseImg && items[0]?.previewImage) {
    expertiseImg.src = imageUrl(items[0].previewImage, 900)
  }

  // Re-init accordion click
  const allItems = accordion.querySelectorAll('.accordion-item')
  allItems.forEach(item => {
    const toggle = item.querySelector('.accordion-item__toggle')
    if (!toggle) return
    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('open')
      allItems.forEach(i => {
        i.classList.remove('open')
        const t = i.querySelector('.accordion-item__toggle')
        if (t) t.setAttribute('aria-expanded', 'false')
      })
      if (!isOpen) {
        item.classList.add('open')
        toggle.setAttribute('aria-expanded', 'true')
      }
    })
  })

  // Re-init image swap on hover
  if (expertiseImg) {
    expertiseImg.style.transition = 'opacity 0.22s ease'
    allItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const src = item.getAttribute('data-image')
        if (!src) return
        expertiseImg.style.opacity = '0'
        setTimeout(() => {
          expertiseImg.src = src
          expertiseImg.style.opacity = '1'
        }, 220)
      })
    })
  }

  if (window.__revealObserver) {
    accordion.querySelectorAll('.reveal').forEach(el => window.__revealObserver.observe(el))
  }
}

/* ─── Build a Sanity CDN URL from an asset _ref string ──────── */
function refToUrl(ref, width = 800) {
  if (!ref) return ''
  // ref = "image-<fileId>-<WxH>-<ext>"
  const parts = ref.split('-')
  const ext  = parts[parts.length - 1]
  const dims = parts[parts.length - 2]
  const id   = parts.slice(1, parts.length - 2).join('-')
  return `https://cdn.sanity.io/images/yt7ymdxw/production/${id}-${dims}.${ext}?w=${width}&auto=format&fit=crop`
}

/* ─── Site settings (hero, socials, avatar) ──────────────────── */
async function loadSiteSettings() {
  let settings
  try {
    settings = await sanityFetch(
      `*[_type == "siteSettings"][0] {
        heroHeadingLine1, heroHeadingLine2, heroSubtitle,
        availableForWork, availableBadgeText,
        email, behanceUrl, linkedinUrl, dribbbleUrl, avatarImage,
        brandSectionTitle, homepageCtaTitle, homepageCtaSubtitle,
        "heroRefs": heroImages[].asset._ref
      }`
    )
  } catch (e) {
    console.warn('Site settings fetch failed:', e)
    return
  }
  if (!settings) return

  const line1 = document.querySelector('.hero__heading-line1')
  const line2 = document.querySelector('.hero__heading-line2')
  const sub   = document.querySelector('.hero__subtitle')
  if (line1 && settings.heroHeadingLine1) line1.textContent = settings.heroHeadingLine1
  if (line2 && settings.heroHeadingLine2) line2.textContent = settings.heroHeadingLine2
  if (sub   && settings.heroSubtitle)     sub.textContent   = settings.heroSubtitle

  if (settings.avatarImage) {
    const avatar = document.querySelector('.topbar__avatar img')
    if (avatar) avatar.src = imageUrl(settings.avatarImage, 96)
  }

  if (settings.behanceUrl)  document.querySelectorAll('[aria-label="Behance"]').forEach(a  => a.href = settings.behanceUrl)
  if (settings.linkedinUrl) document.querySelectorAll('[aria-label="LinkedIn"]').forEach(a => a.href = settings.linkedinUrl)
  if (settings.dribbbleUrl) document.querySelectorAll('[aria-label="Dribbble"]').forEach(a => a.href = settings.dribbbleUrl)
  if (settings.email)       document.querySelectorAll('[aria-label="Contact"]').forEach(a  => { a.href = `mailto:${settings.email}` })

  // Brand section title
  if (settings.brandSectionTitle) {
    const label = document.querySelector('.brand-logos__label')
    if (label) label.textContent = settings.brandSectionTitle
  }

  // Homepage CTA
  if (settings.homepageCtaTitle) {
    const ctaTitle = document.getElementById('homepageCtaTitle')
    if (ctaTitle) ctaTitle.textContent = settings.homepageCtaTitle
  }
  if (settings.homepageCtaSubtitle) {
    const ctaSub = document.getElementById('homepageCtaSubtitle')
    if (ctaSub) ctaSub.textContent = settings.homepageCtaSubtitle
  }
  if (settings.email) {
    const ctaEmail = document.getElementById('homepageCtaEmail')
    if (ctaEmail) ctaEmail.href = `mailto:${settings.email}`
  }
  if (settings.linkedinUrl) {
    const ctaLi = document.getElementById('homepageCtaLinkedin')
    if (ctaLi) ctaLi.href = settings.linkedinUrl
  }

  // Available badge
  const badge = document.querySelector('.available-badge')
  if (badge && settings.availableForWork === false) {
    badge.style.display = 'none'
  } else if (badge && settings.availableBadgeText) {
    const label = badge.querySelector('span:last-child') || badge
    if (label !== badge) label.textContent = settings.availableBadgeText
  }

  // Hero images — built directly from asset refs (no dereference needed)
  const refs = settings.heroRefs?.filter(Boolean) || []
  if (refs.length) {
    const track = document.querySelector('.hero-images__track')
    if (track) {
      const doubled = [...refs, ...refs]
      track.innerHTML = doubled.map(ref => `
        <div class="hero-images__frame">
          <img src="${refToUrl(ref, 900)}" alt="" loading="lazy" />
        </div>
      `).join('')
    }
  }
}

/* ─── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadSiteSettings()
  loadProjects()
  loadTestimonials()
  loadBrandLogos()
  loadExpertise()
  initFilterTabs()
})
