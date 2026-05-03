/* ─── Sanity client (vanilla JS, no bundler needed) ─────────────
   Uses the official @sanity/client ESM build via CDN.
   Replace PROJECT_ID with your real project ID after running
   `sanity init` or checking manage.sanity.io
──────────────────────────────────────────────────────────────── */

const PROJECT_ID = 'yt7ymdxw'
const DATASET    = 'production'
const API_VER    = '2024-01-01'

const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VER}/data/query/${DATASET}`

export async function sanityFetch(query, params = {}) {
  const encoded = encodeURIComponent(query)
  const paramStr = Object.entries(params)
    .map(([k, v]) => `&$${k}=${encodeURIComponent(JSON.stringify(v))}`)
    .join('')
  const res = await fetch(`${BASE}?query=${encoded}${paramStr}`)
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`)
  const { result } = await res.json()
  return result
}

export function imageUrl(asset, width = 800) {
  // Handle dereferenced asset with direct url
  if (asset?.asset?.url) {
    return `${asset.asset.url}?w=${width}&auto=format&fit=crop`
  }
  const ref = asset?.asset?._ref || asset?._ref
  if (!ref) return ''
  // ref format: image-<id>-<WxH>-<ext>
  // Split from the right to safely extract ext and dims
  const parts = ref.split('-')
  const ext  = parts[parts.length - 1]
  const dims = parts[parts.length - 2]
  const id   = parts.slice(1, parts.length - 2).join('-')
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}?w=${width}&auto=format&fit=crop`
}

/* ─── Portable Text → HTML (minimal renderer) ───────────────── */
export function toHtml(blocks = []) {
  if (!blocks?.length) return ''
  return blocks.map(block => {
    if (block._type !== 'block') return ''
    const text = (block.children || [])
      .map(span => {
        let t = span.text || ''
        if (span.marks?.includes('strong')) t = `<strong>${t}</strong>`
        if (span.marks?.includes('em'))     t = `<em>${t}</em>`
        return t
      })
      .join('')
    const style = block.style || 'normal'
    if (style === 'h2') return `<h2 class="project-section-title">${text}</h2>`
    if (style === 'h3') return `<h3>${text}</h3>`
    return `<p>${text}</p>`
  }).join('\n')
}
