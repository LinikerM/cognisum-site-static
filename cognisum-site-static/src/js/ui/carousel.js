// src/js/ui/carousel.js
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.carousel');
  if (!root) return;

  const viewport = root.querySelector('.carousel__viewport');
  const slides = Array.from(root.querySelectorAll('.carousel__slide'));
  const prevBtn = root.querySelector('.carousel__prev');
  const nextBtn = root.querySelector('.carousel__next');
  const dotsWrap = root.querySelector('.carousel__dots');
  const toggleBtn = root.querySelector('.carousel__toggle');
  const autoplay = root.getAttribute('data-autoplay') === 'true';

  let index = 0, timer = null;

  // criar dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ir para o slide ${i+1}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });

  const update = () => {
    viewport.style.transform = `translateX(${-index * 100}%)`;
    dotsWrap.querySelectorAll('button').forEach((b, i) => {
      b.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  };

  const goTo = (i) => { index = (i + slides.length) % slides.length; update(); announce(); };
  const announce = () => viewport.setAttribute('aria-label', `Slide ${index+1} de ${slides.length}`);

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  // teclado
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
  });

  // swipe básico
  let startX = 0;
  viewport.addEventListener('pointerdown', (e) => { startX = e.clientX; viewport.setPointerCapture(e.pointerId); });
  viewport.addEventListener('pointerup', (e) => {
    const dx = e.clientX - startX;
    if (dx > 40) goTo(index - 1);
    if (dx < -40) goTo(index + 1);
  });

  // autoplay opcional (desligado por padrão — recomendado)
  const start = () => { if (timer) return; timer = setInterval(() => goTo(index + 1), 5000); toggleBtn.textContent = '⏸'; toggleBtn.setAttribute('aria-pressed','true'); toggleBtn.setAttribute('aria-label','Pausar rotação automática'); };
  const stop  = () => { clearInterval(timer); timer = null; toggleBtn.textContent = '⏵'; toggleBtn.setAttribute('aria-pressed','false'); toggleBtn.setAttribute('aria-label','Iniciar rotação automática'); };
  toggleBtn.addEventListener('click', () => timer ? stop() : start());
  if (autoplay) start();

  update(); announce();
});
