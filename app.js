window.__APP_LOADED = true;
document.body.classList.add('reveal-ready');
const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const menuButton = document.querySelector('.menu');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 40
    ? '0 10px 30px rgba(23, 22, 20, 0.12)'
    : 'none';
});

const root = document.documentElement;
window.addEventListener('scroll', () => {
  const t = Math.min(window.scrollY / 420, 1);
  root.style.setProperty('--fog', `${t * 14}px`);
  root.style.setProperty('--fog-opacity', `${t * 0.25}`);
});
