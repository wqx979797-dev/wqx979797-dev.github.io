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

const editToggle = document.getElementById('editToggle');
const editableNodes = document.querySelectorAll('[data-edit]');
const editableImages = document.querySelectorAll('[data-edit-image]');
const storageKey = 'ai_pm_portfolio_edits';

function loadEdits() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return;
    editableNodes.forEach((node, idx) => {
      const key = `text-${idx}`;
      if (saved.text && saved.text[key]) {
        node.innerHTML = saved.text[key];
      }
    });
    editableImages.forEach((node, idx) => {
      if (saved.images && saved.images[idx]) {
        if (node.tagName === 'IMG') {
          node.src = saved.images[idx];
        } else {
          node.style.backgroundImage = `url(${saved.images[idx]})`;
          node.classList.add('has-photo');
        }
      }
    });
  } catch (err) {
    // ignore
  }
}

function saveEdits() {
  const payload = { text: {}, images: [] };
  editableNodes.forEach((node, idx) => {
    const key = `text-${idx}`;
    payload.text[key] = node.innerHTML;
  });
  editableImages.forEach((node) => {
    if (node.tagName === 'IMG') {
      payload.images.push(node.src);
    } else {
      payload.images.push(node.style.backgroundImage.replace(/^url\\([\"']?/, '').replace(/[\"']?\\)$/, ''));
    }
  });
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function toggleEditMode() {
  const enabled = editToggle.classList.toggle('active');
  document.body.classList.toggle('editing', enabled);
  editToggle.textContent = enabled ? '编辑中' : '编辑模式';
  editableNodes.forEach((node) => {
    node.contentEditable = enabled ? 'true' : 'false';
    node.classList.toggle('editable', enabled);
  });
  if (!enabled) saveEdits();
}

editToggle?.addEventListener('click', toggleEditMode);

editableImages.forEach((node) => {
  node.addEventListener('click', () => {
    if (!editToggle.classList.contains('active')) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = String(e.target?.result || '');
        if (node.tagName === 'IMG') {
          node.src = dataUrl;
        } else {
          node.style.backgroundImage = `url(${dataUrl})`;
          node.classList.add('has-photo');
        }
        saveEdits();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
});

loadEdits();
