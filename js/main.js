/* ─── Scroll-reveal ──────────────────────────────────────────── */
(function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  // expose so CMS loaders can observe dynamically injected elements
  window.__revealObserver = io;
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 60 + 'ms';
    io.observe(el);
  });
})();

/* ─── Accordion ──────────────────────────────────────────────── */
(function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.accordion-item__header');
    const toggle = item.querySelector('.accordion-item__toggle');
    const trigger = header || toggle;
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        const t = i.querySelector('.accordion-item__toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ─── Works carousel ─────────────────────────────────────────── */
(function initCarousel() {
  const carousel = document.getElementById('worksCarousel');
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.project-card');
  const dots  = document.getElementById('carouselDots');

  function buildDots(count, active) {
    if (!dots) return;
    // keep img but update visually via filter
  }

  // Drag / swipe support
  let startX = 0, scrollStart = 0, isDragging = false;

  carousel.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
  });
  carousel.addEventListener('mousemove', e => {
    if (!isDragging) return;
    carousel.scrollLeft = scrollStart - (e.pageX - startX);
  });
  carousel.addEventListener('mouseup',   () => { isDragging = false; carousel.style.cursor = ''; });
  carousel.addEventListener('mouseleave',() => { isDragging = false; carousel.style.cursor = ''; });
})();

/* ─── Filter tabs ────────────────────────────────────────────── */
(function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
})();

/* ─── Active nav link ────────────────────────────────────────── */
(function setActiveNav() {
  const page  = location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.floating-nav__link');
  // Clear all first
  links.forEach(a => a.classList.remove('active'));
  // Activate only the FIRST link whose href matches current page
  const match = Array.from(links).find(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    return href === page;
  });
  if (match) match.classList.add('active');
})();

/* ─── Project sidebar active section ────────────────────────── */
(function initSidebarSpy() {
  const links   = document.querySelectorAll('.project-sidebar__link');
  const sections = [];
  links.forEach(l => {
    const id = l.getAttribute('href')?.replace('#','');
    if (id) {
      const el = document.getElementById(id);
      if (el) sections.push({ id, el, link: l });
    }
  });
  if (!sections.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const s = sections.find(s => s.el === e.target);
      if (!s) return;
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        s.link.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => io.observe(s.el));
})();

/* ─── Smooth scroll for sidebar links ───────────────────────── */
document.querySelectorAll('.project-sidebar__link[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── Expertise: hover to swap image ────────────────────────── */
(function initExpertiseHover() {
  const items = document.querySelectorAll('.accordion-item[data-image]');
  const imgEl = document.querySelector('.expertise__image img');
  if (!items.length || !imgEl) return;

  imgEl.style.transition = 'opacity 0.22s ease';

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const src = item.getAttribute('data-image');
      if (!src || imgEl.src.endsWith(src)) return;
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = src;
        imgEl.style.opacity = '1';
      }, 220);
    });
  });
})();

/* ─── Floating nav: hide on scroll down, show on scroll up ──── */
(function initNavScroll() {
  const nav = document.querySelector('.floating-nav');
  if (!nav) return;
  let lastY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y > lastY && y > 80) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
})();

/* ─── CV Modal ───────────────────────────────────────────────── */
(function initCVModal() {
  const CV_PATH = 'assets/david-cv.pdf'

  const modal = document.createElement('div')
  modal.id = 'cvModal'
  modal.className = 'cv-modal'
  modal.innerHTML = `
    <div class="cv-modal__backdrop"></div>
    <div class="cv-modal__panel">
      <div class="cv-modal__header">
        <span class="cv-modal__title">Curriculum Vitae</span>
        <div class="cv-modal__actions">
          <a href="${CV_PATH}" target="_blank" rel="noopener" class="cv-modal__action-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H6M12 2V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            New Tab
          </a>
          <a href="${CV_PATH}" download="David-Ironali-CV.pdf" class="cv-modal__action-btn cv-modal__action-btn--download">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v7M4 6.5L7 9.5 10 6.5M2 11h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Download
          </a>
          <button class="cv-modal__close" aria-label="Close CV">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="cv-modal__body">
        <iframe title="David Ironali CV"></iframe>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  const backdrop = modal.querySelector('.cv-modal__backdrop')
  const closeBtn = modal.querySelector('.cv-modal__close')
  const iframe   = modal.querySelector('iframe')

  function open() {
    if (!iframe.src) iframe.src = CV_PATH
    modal.classList.add('open')
    document.body.style.overflow = 'hidden'
  }
  function close() {
    modal.classList.remove('open')
    document.body.style.overflow = ''
  }

  backdrop.addEventListener('click', close)
  closeBtn.addEventListener('click', close)
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close() })

  window.openCV  = open
  window.closeCV = close
})();
