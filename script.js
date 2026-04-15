const toggle = document.querySelector('.navbar__toggle');
const navLinks = document.querySelector('.navbar__links');

toggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (navLinks?.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !toggle.contains(e.target)) {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

const revealTargets = [
  '.step-card',
  '.benefit-card',
  '.schedule',
  '.location-card',
  '.cta-banner',
  '.section__header',
  '.footer__brand',
  '.footer__about',
  '.footer__links',
];

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children].filter(
          c => c.classList.contains('reveal')
        );
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll(revealTargets.join(',')).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

const navbar = document.querySelector('.navbar');
const hero   = document.querySelector('.hero');

if (hero) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      navbar.style.boxShadow = entry.isIntersecting
        ? 'none'
        : '0 4px 20px rgba(0,0,0,.25)';
    },
    { threshold: 0.1 }
  );
  heroObserver.observe(hero);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Cookie Consent (LGPD) ────────────────────────────────────────────
(function initCookieConsent() {
  const banner           = document.getElementById('cookie-banner');
  const modal            = document.getElementById('cookie-modal');
  const btnAccept        = document.getElementById('cookie-accept');
  const btnConfigure     = document.getElementById('cookie-configure');
  const btnRejectAll     = document.getElementById('cookie-reject-all');
  const btnSave          = document.getElementById('cookie-save');
  const btnClose         = modal && modal.querySelector('.cookie-modal__close');
  const backdrop         = modal && modal.querySelector('.cookie-modal__backdrop');
  const toggleMarketing  = document.getElementById('cookie-toggle-marketing');

  if (!banner) return;

  // Already decided on a previous visit — stay silent
  const consent = localStorage.getItem('cookie_consent');
  if (consent === 'granted' || consent === 'denied') return;

  // ── Show / hide helpers ─────────────────────────────────────────────
  function hideBanner() {
    banner.classList.remove('is-visible');
  }

  function openModal() {
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // ── Accept: grant consent, load pixel, close everything ────────────
  function acceptAll() {
    localStorage.setItem('cookie_consent', 'granted');
    hideBanner();
    closeModal();
    if (typeof loadMetaPixel === 'function') loadMetaPixel();
  }

  // ── Deny: record denial and close everything ────────────────────────
  function denyAll() {
    localStorage.setItem('cookie_consent', 'denied');
    hideBanner();
    closeModal();
  }

  // ── Save: respect the toggle state ─────────────────────────────────
  function savePreferences() {
    const marketingAllowed = toggleMarketing && toggleMarketing.checked;
    if (marketingAllowed) {
      acceptAll();
    } else {
      denyAll();
    }
  }

  // ── Show the banner after 200px scroll OR 4 s ──────────────────────
  let shown = false;

  function showBanner() {
    if (shown) return;
    shown = true;
    banner.classList.add('is-visible');
    window.removeEventListener('scroll', onScroll);
    clearTimeout(timer);
  }

  function onScroll() {
    if (window.scrollY >= 200) showBanner();
  }

  const timer = setTimeout(showBanner, 4000);
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Event listeners ────────────────────────────────────────────────
  btnAccept.addEventListener('click', acceptAll);
  btnConfigure.addEventListener('click', openModal);
  btnRejectAll.addEventListener('click', denyAll);
  btnSave.addEventListener('click', savePreferences);
  btnClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Sync aria-checked on the slider when toggle changes
  if (toggleMarketing) {
    toggleMarketing.addEventListener('change', () => {
      const slider = toggleMarketing.nextElementSibling;
      if (slider) slider.setAttribute('aria-checked', String(toggleMarketing.checked));
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) closeModal();
  });
})();
