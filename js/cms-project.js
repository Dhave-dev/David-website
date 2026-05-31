import { sanityFetch, imageUrl, toHtml } from './sanity.js?v=3'

/* ─── Slug → anchor ID ───────────────────────────────────────── */
function toId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/* ─── Main project loader ────────────────────────────────────── */
async function loadProject() {
  const slug = new URLSearchParams(location.search).get('slug')
  const titleEl   = document.querySelector('.project-header__title')
  const contentEl = document.getElementById('projectContent')

  if (!slug) {
    if (titleEl)   titleEl.textContent = 'No project selected'
    if (contentEl) contentEl.innerHTML = '<p style="color:#555;padding:80px 0;text-align:center;">Go to <a href="works.html" style="color:inherit;text-decoration:underline;">Works</a> and pick a project.</p>'
    document.getElementById('projectLiveBtn')?.style && (document.getElementById('projectLiveBtn').style.display = 'none')
    return
  }

  let p
  try {
    p = await sanityFetch(
      `*[_type == "project" && slug.current == $slug][0] {
        title, slug, tags, category, startDate, endDate,
        description, liveUrl, coverImage,
        sections[] {
          title, body,
          subsections[] { title, body },
          images[] { asset->, alt, caption }
        },
        processGallery[] { asset->, alt, caption },
        brandIdentityFile { asset-> { url } }
      }`,
      { slug }
    )
  } catch (e) {
    console.error('Failed to load project:', e)
    if (titleEl)   titleEl.textContent = 'Could not load project'
    if (contentEl) contentEl.innerHTML = '<p style="color:#555;padding:80px 0;text-align:center;">Something went wrong. Please try again.</p>'
    return
  }

  if (!p) {
    if (titleEl)   titleEl.textContent = 'Project not found'
    if (contentEl) contentEl.innerHTML = '<p style="color:#555;padding:80px 0;text-align:center;">This project does not exist.</p>'
    return
  }

  /* ── Page title + meta tags ── */
  document.title = `${p.title} — David Ironali`
  document.querySelector('.project-header__title').textContent = p.title

  const ogImage = p.coverImage ? imageUrl(p.coverImage, 1200) : null
  const ogUrl   = `https://davidironali.com/project?slug=${p.slug.current}`
  const desc    = p.description || `A case study by David Ironali — ${p.category || 'Product Designer'}.`

  const setMeta = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.setAttribute('content', val) }
  setMeta('meta[name="description"]', desc)
  setMeta('meta[property="og:title"]', `${p.title} — David Ironali`)
  setMeta('meta[property="og:description"]', desc)
  setMeta('meta[property="og:url"]', ogUrl)
  if (ogImage) {
    setMeta('meta[property="og:image"]', ogImage)
    setMeta('meta[name="twitter:image"]', ogImage)
  }
  setMeta('meta[name="twitter:title"]', `${p.title} — David Ironali`)
  setMeta('meta[name="twitter:description"]', desc)

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

  /* ── Brand Identity PDF — view-only modal ── */
  const pdfUrl = p.brandIdentityFile?.asset?.url
  if (pdfUrl) {
    const metaBar = document.querySelector('.project-meta-bar')
    if (metaBar) {
      const pdfBtn = document.createElement('button')
      pdfBtn.className = 'btn btn-dark btn-wide'
      pdfBtn.style.marginLeft = '12px'
      pdfBtn.textContent = 'View Brand Kit'
      pdfBtn.addEventListener('click', () => openPdfModal(pdfUrl))
      metaBar.appendChild(pdfBtn)
    }

    /* Build modal once */
    if (!document.getElementById('pdfModal')) {
      const modal = document.createElement('div')
      modal.id = 'pdfModal'
      modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:none;flex-direction:column;'
      modal.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #2a2a2c;">
          <span style="color:#fff;font-size:15px;font-weight:500;">${p.title} — Brand Identity</span>
          <button onclick="document.getElementById('pdfModal').style.display='none'" style="background:none;border:1px solid #333;border-radius:8px;color:#aaa;padding:6px 14px;cursor:pointer;font-size:13px;">Close</button>
        </div>
        <iframe id="pdfFrame" src="" style="flex:1;width:100%;border:none;background:#1a1a1a;" title="Brand Identity PDF"></iframe>
      `
      document.body.appendChild(modal)
    }
  }

  window.openPdfModal = (url) => {
    const modal = document.getElementById('pdfModal')
    const frame = document.getElementById('pdfFrame')
    if (!modal || !frame) return
    frame.src = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    modal.style.display = 'flex'
  }

  /* Close modal on backdrop click */
  document.getElementById('pdfModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'pdfModal') e.target.style.display = 'none'
  })

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

    const imagesHtml = (sec.images || []).map(img => {
      const src = imageUrl(img, 1200)
      if (!src) return ''
      return `
      <div class="project-img-block reveal">
        <img src="${src}" alt="${img.alt || sec.title}" loading="lazy" />
        ${img.caption ? `<p class="project-img-caption">${img.caption}</p>` : ''}
      </div>`
    }).join('')

    return `
      <div id="${id}" class="project-section reveal">
        <h2 class="project-section-title">${sec.title}</h2>
        ${bodyHtml ? `<div class="project-section-text">${bodyHtml}</div>` : ''}
        ${subsectionsHtml}
        ${imagesHtml}
      </div>
    `
  }).join('')

  /* ── Process gallery ── */
  if (p.processGallery?.length) {
    const gallerySection = document.createElement('div')
    gallerySection.className = 'process-gallery'
    gallerySection.innerHTML = `
      <h2 class="process-gallery__title">Design Process</h2>
      <div class="process-gallery__grid">
        ${p.processGallery.map((img, i) => {
          const src = imageUrl(img, 1400)
          if (!src) return ''
          return `
          <div class="process-gallery__item reveal">
            <img src="${src}" alt="${img.alt || 'Process image ' + (i + 1)}" loading="lazy" />
            ${img.caption ? `<p class="process-gallery__caption">${img.caption}</p>` : ''}
          </div>`
        }).join('')}
      </div>
    `
    content.after(gallerySection)
    if (window.__revealObserver) {
      gallerySection.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = i * 60 + 'ms'
        window.__revealObserver.observe(el)
      })
    }
  }

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
    <a href="project?slug=${p.slug.current}" class="project-card-sm reveal">
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
