/**
 * Sélecteur de zones du véhicule : relie le schéma SVG aux cases à cocher (src/components/VehicleZones.astro).
 * Les cases restent la source de vérité (envoyées avec le formulaire) ; le schéma les reflète et les modifie.
 * « Je ne sais pas » est exclusif : le choisir décoche les zones, choisir une zone le décoche.
 * À charger APRÈS quote-form (qui restaure la saisie conservée) pour que le schéma reflète l'état restauré.
 */
document.querySelectorAll<HTMLElement>('[data-zones]').forEach((root) => {
  const boxes = [...root.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name="zones[]"]')];
  const unknown = boxes.find((b) => b.value === 'inconnu');
  const shapes = new Map<string, SVGElement>();
  root.querySelectorAll<SVGElement>('[data-zone]').forEach((el) => shapes.set(el.dataset.zone!, el));

  const sync = () => boxes.forEach((b) => shapes.get(b.value)?.classList.toggle('is-on', b.checked));

  boxes.forEach((b) => {
    b.addEventListener('change', () => {
      if (b === unknown && b.checked) boxes.forEach((o) => { if (o !== b) o.checked = false; });
      else if (b.checked && unknown) unknown.checked = false;
      sync();
    });
    // Survol/focus d'une case : met la zone en évidence sur le schéma
    const hot = (on: boolean) => shapes.get(b.value)?.classList.toggle('is-hot', on);
    b.addEventListener('focus', () => hot(true));
    b.addEventListener('blur', () => hot(false));
    b.parentElement?.addEventListener('mouseenter', () => hot(true));
    b.parentElement?.addEventListener('mouseleave', () => hot(false));
  });

  shapes.forEach((el, value) => {
    el.addEventListener('click', () => {
      const box = boxes.find((b) => b.value === value);
      if (!box) return;
      box.checked = !box.checked;
      box.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  sync();
});
