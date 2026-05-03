import { sanityFetch, imageUrl } from './sanity.js'

async function loadAbout() {
  const settings = await sanityFetch(
    `*[_type == "siteSettings"][0] {
      aboutBio, availableForWork, availableBadgeText,
      behanceUrl, linkedinUrl, instagramUrl, email, cvUrl,
      portraitImage, avatarImage
    }`
  )

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

  // Portrait
  if (settings.portraitImage) {
    const portrait = document.querySelector('.portrait-card__photo img')
    if (portrait) portrait.src = imageUrl(settings.portraitImage, 600)
  }

  // Social links — all pages share the same social-btn aria-labels
  if (settings.behanceUrl)  document.querySelectorAll('[aria-label="Behance"]').forEach(a  => a.href = settings.behanceUrl)
  if (settings.linkedinUrl) document.querySelectorAll('[aria-label="LinkedIn"]').forEach(a => a.href = settings.linkedinUrl)
  if (settings.instagramUrl)document.querySelectorAll('[aria-label="Instagram"]').forEach(a=> a.href = settings.instagramUrl)

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

document.addEventListener('DOMContentLoaded', loadAbout)
