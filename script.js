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
