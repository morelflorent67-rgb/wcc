/**
 * Ajout de photos au formulaire carrosserie.
 *
 * Amélioration progressive : sans JavaScript, le champ fichier natif envoie les photos telles quelles
 * (le serveur contrôle type et poids). Avec JavaScript, chaque photo est réduite dans le navigateur
 * (côté le plus long ≈ 1600 px, JPEG) avant l'envoi : un téléphone produit des fichiers de plusieurs Mo,
 * inutiles pour établir un devis et lourds pour la boîte de réception du garage.
 *
 * Le champ <input type="file" name="photos[]"> reste la seule source des fichiers envoyés : on y réécrit la
 * sélection (DataTransfer) après chaque ajout ou suppression.
 *
 * Les limites doivent rester cohérentes avec api/config.php (max_files, max_file_mb).
 */
const MAX_SIDE = 1600;
const QUALITY = 0.82;
const MAX_BYTES = 8 * 1024 * 1024;
const SENDABLE = ['image/jpeg', 'image/png', 'image/webp'];

interface Decoded { source: CanvasImageSource; width: number; height: number; release: () => void; }
interface Item { file: File; url: string; }

async function decode(file: File): Promise<Decoded> {
  if ('createImageBitmap' in window) {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bmp, width: bmp.width, height: bmp.height, release: () => bmp.close() };
    } catch { /* format non pris en charge par cette méthode : on essaie avec une image */ }
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  try { await img.decode(); } catch { URL.revokeObjectURL(url); throw new Error('decode'); }
  return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) };
}

/** Réduit une photo ; lève une erreur si le navigateur ne sait pas la lire ou l'encoder. */
async function shrink(file: File): Promise<File> {
  const img = await decode(file);
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    ctx.fillStyle = '#fff'; // fond blanc pour les PNG/WebP transparents
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img.source, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', QUALITY));
    if (!blob) throw new Error('encode');
    // Déjà petite et dans un format accepté : on garde l'original plutôt que de recompresser
    if (scale === 1 && blob.size >= file.size && SENDABLE.includes(file.type)) return file;
    const base = file.name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'photo';
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } finally {
    img.release();
  }
}

function initPhotos(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>('input[type="file"]');
  const list = root.querySelector<HTMLElement>('[data-thumbs]');
  const status = root.querySelector<HTMLElement>('[data-photo-status]');
  const error = root.querySelector<HTMLElement>('[data-photo-error]');
  if (!input || !list || !('DataTransfer' in window)) return; // le champ natif continue de fonctionner

  const max = Number(root.dataset.max ?? 6);
  const form = input.form;
  let items: Item[] = [];
  let pending = 0;

  const setError = (msg: string) => {
    if (!error) return;
    error.hidden = !msg;
    error.textContent = msg;
  };
  const setBusy = (busy: boolean) => {
    form?.querySelectorAll<HTMLButtonElement>('[data-next], [data-submit]').forEach((b) => { b.disabled = busy; });
    root.toggleAttribute('aria-busy', busy);
  };

  /** Réécrit la sélection du champ fichier et l'affichage. */
  const commit = () => {
    const dt = new DataTransfer();
    items.forEach((it) => dt.items.add(it.file));
    input.files = dt.files;
    list.replaceChildren(
      ...items.map((it, i) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = it.url;
        img.alt = `Photo ${i + 1}`;
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.setAttribute('aria-label', `Retirer la photo ${i + 1}`);
        rm.textContent = '×';
        rm.addEventListener('click', () => {
          URL.revokeObjectURL(it.url);
          items = items.filter((x) => x !== it);
          setError('');
          commit();
          (list.querySelector<HTMLElement>('button') ?? input).focus();
        });
        li.append(img, rm);
        return li;
      }),
    );
    if (status) {
      status.textContent = items.length === 0 ? '' : items.length === 1 ? '1 photo prête à l’envoi.' : `${items.length} photos prêtes à l’envoi.`;
    }
    root.classList.toggle('has-items', items.length > 0);
  };

  input.addEventListener('change', async () => {
    const picked = [...(input.files ?? [])];
    if (!picked.length) return;
    // On remet immédiatement la sélection courante : le champ ne doit contenir que les photos validées
    const keep = new DataTransfer();
    items.forEach((it) => keep.items.add(it.file));
    input.files = keep.files;

    setError('');
    const room = max - items.length;
    const accepted = picked.slice(0, Math.max(0, room));
    const problems: string[] = [];
    if (picked.length > accepted.length) problems.push(`Vous pouvez joindre ${max} photos au maximum.`);

    pending += 1;
    setBusy(true);
    if (status) status.textContent = 'Préparation des photos…';
    for (const file of accepted) {
      try {
        const out = await shrink(file);
        if (out.size > MAX_BYTES) { problems.push(`« ${file.name} » est trop volumineuse.`); continue; }
        items.push({ file: out, url: URL.createObjectURL(out) });
      } catch {
        // Illisible par le navigateur : on la garde telle quelle si le serveur sait la traiter
        if (SENDABLE.includes(file.type) && file.size <= MAX_BYTES) items.push({ file, url: URL.createObjectURL(file) });
        else problems.push(`« ${file.name} » n’a pas pu être lue (utilisez une photo JPEG, PNG ou WebP).`);
      }
    }
    pending -= 1;
    if (pending === 0) setBusy(false);
    commit();
    if (problems.length) setError(problems.join(' '));
  });

  root.classList.add('is-ready');
  // Un rafraîchissement (retour arrière) peut laisser des fichiers dans le champ : on repart d'une sélection vide
  if (input.files?.length) input.value = '';
}

document.querySelectorAll<HTMLElement>('[data-photos]').forEach(initPhotos);
