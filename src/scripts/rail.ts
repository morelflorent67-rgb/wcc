/**
 * Rails de cartes à défilement horizontal (src/components/PhotoRail.astro).
 * - flèches précédent / suivant (désactivées aux extrémités) et barre de progression ;
 * - glisser à la souris (le doigt utilise le défilement natif) sans déclencher les liens ;
 * - onglets de famille : masquent les cartes d'une autre famille et renumérotent les autres.
 */
const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

function initRail(root: HTMLElement) {
  const rail = root.querySelector<HTMLElement>('[data-rail]');
  if (!rail) return;
  const prev = root.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-rail-next]');
  const bar = root.querySelector<HTMLElement>('[data-rail-prog]');
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-rail-tab]')];
  const items = [...rail.children] as HTMLElement[];

  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    if (prev) prev.disabled = rail.scrollLeft < 4;
    if (next) next.disabled = rail.scrollLeft > max - 4;
    if (bar) {
      const w = Math.min(1, rail.clientWidth / Math.max(1, rail.scrollWidth));
      bar.style.width = `${w * 100}%`;
      bar.style.left = `${max > 0 ? (rail.scrollLeft / max) * (1 - w) * 100 : 0}%`;
    }
  };
  rail.addEventListener('scroll', update, { passive: true });
  // Le menu est masqué à l'ouverture de la page : la taille change quand il s'affiche
  new ResizeObserver(update).observe(rail);

  const step = () => rail.clientWidth * 0.8;
  prev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: smooth() }));
  next?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: smooth() }));

  // Glisser à la souris
  let down = false, moved = false, startX = 0, startLeft = 0;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) { moved = true; rail.classList.add('is-dragging'); }
    if (moved) rail.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    window.setTimeout(() => rail.classList.remove('is-dragging'), 0);
  });
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  rail.addEventListener('dragstart', (e) => e.preventDefault());

  // Onglets de famille
  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      const fam = tab.dataset.railTab;
      tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
      let n = 0;
      items.forEach((li) => {
        const show = fam === 'all' || li.dataset.family === fam;
        li.hidden = !show;
        const num = li.querySelector<HTMLElement>('[data-num]');
        if (show && num) num.textContent = String(++n).padStart(2, '0');
      });
      rail.scrollLeft = 0;
      update();
    }),
  );

  update();
}

document.querySelectorAll<HTMLElement>('[data-rail-root]').forEach(initRail);
