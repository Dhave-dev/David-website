import { sanityFetch, imageUrl } from './sanity.js'

const ARROW_SVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M5 15L15 5M15 5H7M15 5V13" stroke="rgba(255,255,255,0.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

function renderItem(p, isLast) {
  return `
    <div data-filter="${p.filterCategory || 'product-design'}">
      <div class="works-list-item reveal">
        <a href="project.html?slug=${p.slug.current}" class="works-list-item__img">
          <img src="${imageUrl(p.coverImage, 700)}" alt="${p.title}" loading="lazy" />
        </a>
        <div class="works-list-item__info">
          <div class="works-list-item__title-row">
            <h2 class="works-list-item__title">${p.title}</h2>
            <a href="project.html?slug=${p.slug.current}" class="works-list-item__arrow" aria-label="Open project">
              ${ARROW_SVG}
            </a>
          </div>
          ${p.description ? `<p class="works-list-item__desc">${p.description}</p>` : ''}
          <div class="works-list-item__meta">
            ${p.client ? `
              <div class="works-list-item__meta-row">
                <span class="works-list-item__meta-key">Client:</span>
                <span class="works-list-item__meta-val">${p.client}</span>
              </div>` : ''}
            ${p.date ? `
              <div class="works-list-item__meta-row">
                <span class="works-list-item__meta-key">Date:</span>
                <span class="works-list-item__meta-val">${p.date}</span>
              </div>` : ''}
            <div class="works-list-item__meta-row">
              <span class="works-list-item__meta-key">Category:</span>
              <span class="works-list-item__meta-val">${p.category}</span>
            </div>
          </div>
        </div>
      </div>
      ${isLast ? '' : '<div class="works-list-item__sep" style="margin-top:42px;"></div>'}
    </div>
  `
}

async function loadWorks() {
  const grid = document.getElementById('worksGrid')
  if (!grid) return

  let projects
  try {
    projects = await sanityFetch(
      `*[_type == "project"] | order(order asc) {
        _id, title, slug, category, filterCategory,
        description, date, client, coverImage
      }`
    )
  } catch (e) {
    grid.innerHTML = '<p style="padding:60px 0;color:#666;text-align:center;">Could not load projects.</p>'
    return
  }

  if (!projects?.length) {
    grid.innerHTML = '<p style="padding:60px 0;color:#555;text-align:center;">No projects yet — add some in the CMS.</p>'
    return
  }

  grid.innerHTML = projects.map((p, i) => renderItem(p, i === projects.length - 1)).join('')

  // re-run reveal observer on injected elements
  if (window.__revealObserver) {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * 60 + 'ms'
      window.__revealObserver.observe(el)
    })
  }

  initFilter(projects)
}

function initFilter(allProjects) {
  const tabs = document.querySelectorAll('.filter-tab')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      const filter = tab.dataset.filter

      document.querySelectorAll('#worksGrid > div[data-filter]').forEach(item => {
        const match = filter === 'all' || item.dataset.filter === filter
        item.style.display = match ? '' : 'none'
        // also hide/show separator of previous item
        const sep = item.querySelector('.works-list-item__sep')
        if (sep) sep.style.display = match ? '' : 'none'
      })
    })
  })
}

document.addEventListener('DOMContentLoaded', loadWorks)
