import { sanityFetch, imageUrl, toHtml } from './sanity.js'

/* ─── Slug → anchor ID ───────────────────────────────────────── */
function toId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/* ─── Main project loader ────────────────────────────────────── */
async function loadProject() {
  const slug = new URLSearchParams(location.search).get('slug')
  if (!slug) return

  let p
  try {
    p = await sanityFetch(
      `*[_type == "project" && slug.current == $slug][0] {
        title, slug, tags, category, startDate, endDate,
        description, liveUrl, coverImage,
        sections[] {
          title, body,
          subsections[] { title, body },
          images[] { asset, alt, caption }
        }
      }`,
      { slug }
    )
  } catch (e) {
    console.error('Failed to load project:', e)
    return
  }

  if (!p) {
    document.getElementById('projectContent').innerHTML =
      '<p style="color:#555;padding:80px 0;text-align:center;">Project not found.</p>'
    return
  }

  /* ── Page title ── */
  document.title = `${p.title} — David Ironali`
  document.querySelector('.project-header__title').textContent = p.title

  /* ── Tags ── */
  const tagsEl = document.getElementById('projectTags')
  if (tagsEl && p.tags?.length) {
    tagsEl.innerHTML = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')
  }

  /* ── Date ── */
  const dateEl = document.getElementById('projectDate')
  if (dateEl) {
    const parts = [p.startDate, p.endDate].filter(Boolean)
    dateEl.textContent = parts.join(' – ')
  }

  /* ── Live site button ── */
  const liveBtn = document.getElementById('projectLiveBtn')
  if (liveBtn) {
    if (p.liveUrl) {
      liveBtn.href = p.liveUrl
      liveBtn.setAttribute('target', '_blank')
      liveBtn.setAttribute('rel', 'noopener')
    } else {
      liveBtn.style.display = 'none'
    }
  }

  /* ── Build sidebar + content from flexible sections ── */
  const sidebar  = document.getElementById('projectSidebar')
  const content  = document.getElementById('projectContent')

  if (!p.sections?.length) {
    content.innerHTML = '<p style="color:#555;padding:80px 0;">No content yet.</p>'
    return
  }

  /* Sidebar */
  sidebar.innerHTML = p.sections.map((sec, i) => {
    const id = toId(sec.title)
    return `<a href="#${id}" class="project-sidebar__link${i === 0 ? ' active' : ''}">${sec.title}</a>`
  }).join('')

  /* Content */
  content.innerHTML = p.sections.map((sec, i) => {
    const id = toId(sec.title)
    const bodyHtml = toHtml(sec.body)

    const subsectionsHtml = (sec.subsections || []).map(sub => `
      <div class="project-subsection">
        <h3 class="project-subsection-title">${sub.title}</h3>
        <div class="project-section-text">${toHtml(sub.body)}</div>
      </div>
    `).join('')

    const imagesHtml = (sec.images || []).map(img => `
      <div class="project-img-block reveal">
        <img src="${imageUrl(img, 1200)}" alt="${img.alt || sec.title}" loading="lazy" />
        ${img.caption ? `<p class="project-img-caption">${img.caption}</p>` : ''}
      </div>
    `).join('')

    return `
      <div id="${id}" class="project-section reveal">
        <h2 class="project-section-title">${sec.title}</h2>
        ${bodyHtml ? `<div class="project-section-text">${bodyHtml}</div>` : ''}
        ${subsectionsHtml}
        ${imagesHtml}
      </div>
    `
  }).join('')

  /* ── Sidebar scroll spy ── */
  initSidebarSpy()

  /* ── Smooth scroll ── */
  sidebar.querySelectorAll('.project-sidebar__link[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      const el = document.getElementById(a.getAttribute('href').slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  /* ── Reveal observer on injected elements ── */
  if (window.__revealObserver) {
    content.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 80 + 'ms'
      window.__revealObserver.observe(el)
    })
  }
}

function initSidebarSpy() {
  const links    = document.querySelectorAll('.project-sidebar__link')
  const sections = []
  links.forEach(l => {
    const id = l.getAttribute('href')?.replace('#', '')
    if (id) {
      const el = document.getElementById(id)
      if (el) sections.push({ el, link: l })
    }
  })
  if (!sections.length) return

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const s = sections.find(s => s.el === e.target)
      if (!s) return
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'))
        s.link.classList.add('active')
      }
    })
  }, { rootMargin: '-20% 0px -70% 0px' })

  sections.forEach(s => io.observe(s.el))
}

/* ─── Other works section ────────────────────────────────────── */
async function loadOtherWorks() {
  const slug = new URLSearchParams(location.search).get('slug') || ''
  const grid = document.getElementById('otherWorksCards')
  if (!grid) return

  const projects = await sanityFetch(
    `*[_type == "project" && slug.current != $slug] | order(orderRank asc) [0...3] {
      _id, title, slug, category, coverImage
    }`,
    { slug }
  )

  if (!projects?.length) {
    grid.closest('section')?.style && (grid.closest('section').style.display = 'none')
    return
  }

  grid.innerHTML = projects.map(p => `
    <a href="project.html?slug=${p.slug.current}" class="project-card-sm reveal">
      <div class="project-card-sm__img-wrap">
        <div class="project-card-sm__img">
          <img src="${imageUrl(p.coverImage, 600)}" alt="${p.title}" loading="lazy" />
        </div>
      </div>
      <div class="project-card-sm__bottom">
        <div>
          <div class="project-card-sm__label">${p.category}</div>
          <div class="project-card-sm__title">${p.title}</div>
        </div>
        <div class="project-card-sm__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 15L15 5M15 5H7M15 5V13" stroke="rgba(255,255,255,0.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </a>
  `).join('')

  if (window.__revealObserver) {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = i * 80 + 'ms'
      window.__revealObserver.observe(el)
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProject()
  loadOtherWorks()
})
