// src/js/ui/navbar.js

// Aguarda o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
  // ====== 1) Realce do link ativo no header ======
  const headerNavLinks = document.querySelectorAll('header nav a');

  // Normaliza e extrai apenas o "arquivo.html" do caminho
  const getFileName = (urlString) => {
    try {
      const u = new URL(urlString, window.location.href);
      const name = u.pathname.split('/').pop();
      // se estiver na raiz ("/" ou "/src/"), considera index.html
      return (name && name.length > 0 ? name : 'index.html').toLowerCase();
    } catch {
      return 'index.html';
    }
  };

  const currentFile = getFileName(window.location.href);

  headerNavLinks.forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const linkFile = getFileName(href);
    if (linkFile === currentFile) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    } else {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    }
  });

  // ====== 2) Sombra no header ao rolar ======
  const header = document.querySelector('header.header');
  const applyShadow = () => {
    if (!header) return;
    header.classList.toggle('scrolled', (window.scrollY || document.documentElement.scrollTop) > 2);
  };

  // Aplica imediatamente e depois escuta o scroll (com rAF para suavizar)
  applyShadow();
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        applyShadow();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ====== 3) (Opcional) Toggle de menu mobile, se existir ======
  // Adicione no HTML um botão com data-menu-toggle para usar isso.
  const toggleBtn = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('header .navbar nav');
  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', nav.classList.contains('is-open') ? 'true' : 'false');
    });
  }
});
