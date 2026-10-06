/**
 * Formulaire de demande de devis en étapes (mécanique et carrosserie).
 *
 * Amélioration progressive : sans JavaScript, le formulaire reste un formulaire HTML classique
 * (toutes les étapes visibles, envoi par POST). Avec JavaScript : une étape à la fois, retour
 * arrière sans perte, saisie conservée dans sessionStorage, récapitulatif, envoi sans rechargement.
 */

interface RecapRow {
  label: string;
  fields: string[];
  join?: string;
  units?: Record<string, string>;
}

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const SKIP = new Set(['ts', 'website', 'type']);

function initQuoteForm(form: HTMLFormElement) {
  const type = form.dataset.type ?? 'form';
  const KEY = `wcc-form-${type}`;
  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
  const crumbs = [...form.querySelectorAll<HTMLElement>('[data-progress] li')];
  const prev = form.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const recapOut = form.querySelector<HTMLElement>('[data-recap-out]');
  const recapCfg = JSON.parse(form.dataset.recap ?? '[]') as RecapRow[];
  const scope = form.closest('[data-form-scope]') ?? document;
  const success = scope.querySelector<HTMLElement>('[data-success]');
  const failure = scope.querySelector<HTMLElement>('[data-error]');
  let current = 0;

  form.classList.add('is-enhanced');
  const ts = form.querySelector<HTMLInputElement>('input[name="ts"]');
  if (ts) ts.value = String(Date.now());

  const fields = () => [...form.elements].filter((el): el is Field => /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && !!(el as Field).name);
  const named = (name: string) => fields().filter((f) => f.name === name);

  // ───── Conservation de la saisie ─────
  const save = () => {
    const data: Record<string, string | string[]> = {};
    for (const f of fields()) {
      if (SKIP.has(f.name) || (f instanceof HTMLInputElement && (f.type === 'file' || f.type === 'hidden'))) continue;
      if (f instanceof HTMLInputElement && f.type === 'checkbox') {
        if (f.name.endsWith('[]')) {
          const arr = (data[f.name] as string[] | undefined) ?? [];
          if (f.checked) arr.push(f.value);
          data[f.name] = arr;
        } else data[f.name] = f.checked ? f.value : '';
      } else if (f instanceof HTMLInputElement && f.type === 'radio') {
        if (f.checked) data[f.name] = f.value;
      } else data[f.name] = f.value;
    }
    try { sessionStorage.setItem(KEY, JSON.stringify({ data, step: current })); } catch { /* stockage indisponible */ }
  };
  const restore = () => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return;
      const { data, step } = JSON.parse(raw) as { data: Record<string, string | string[]>; step: number };
      for (const f of fields()) {
        if (!(f.name in data) || SKIP.has(f.name)) continue;
        const v = data[f.name];
        if (f instanceof HTMLInputElement && f.type === 'checkbox') f.checked = Array.isArray(v) ? v.includes(f.value) : v === f.value;
        else if (f instanceof HTMLInputElement && f.type === 'radio') f.checked = v === f.value;
        else if (!(f instanceof HTMLInputElement && (f.type === 'file' || f.type === 'hidden'))) f.value = String(v);
      }
      current = Math.min(Math.max(step ?? 0, 0), steps.length - 1);
    } catch { /* données illisibles : on repart de zéro */ }
  };
  restore();

  // Préremplissage depuis l'adresse : ?prestation=freinage (répétable ou séparé par des virgules)
  const params = new URLSearchParams(location.search);
  const wanted = [...params.getAll('prestation'), ...(params.get('prestations')?.split(',') ?? [])].filter(Boolean);
  if (wanted.length) {
    for (const slug of wanted) {
      const cb = form.querySelector<HTMLInputElement>(`input[name="prestations[]"][value="${CSS.escape(slug)}"]`);
      if (cb) cb.checked = true;
    }
    current = 0;
  }

  // ───── Affichage des étapes ─────
  const stepError = (fs: HTMLElement, msg?: string) => {
    const el = fs.querySelector<HTMLElement>('[data-step-error]');
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg ?? '';
  };

  const show = (i: number, focus = true) => {
    current = i;
    steps.forEach((fs, n) => { fs.hidden = n !== i; });
    crumbs.forEach((c, n) => {
      c.classList.toggle('is-done', n < i);
      c.classList.toggle('is-current', n === i);
      if (n === i) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current');
    });
    prev.hidden = i === 0;
    next.hidden = i === steps.length - 1;
    submit.hidden = i !== steps.length - 1;
    if (i === steps.length - 1) buildRecap();
    updateCount();
    if (focus) {
      const legend = steps[i].querySelector<HTMLElement>('legend');
      legend?.focus({ preventScroll: true });
      (form.closest('[data-form-scope]') as HTMLElement | null)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
    save();
  };

  // ───── Validation d'une étape ─────
  const validateStep = (i: number): boolean => {
    const fs = steps[i];
    stepError(fs);
    const any = fs.dataset.requireAny?.split(',').map((s) => s.trim()).filter(Boolean);
    if (any?.length) {
      const filled = any.some((name) => named(name).some((f) => (f instanceof HTMLInputElement && (f.type === 'checkbox' || f.type === 'radio') ? f.checked : f.value.trim() !== '')));
      if (!filled) {
        stepError(fs, fs.dataset.requireMsg ?? 'Merci de faire au moins un choix.');
        (named(any[0])[0] as HTMLElement | undefined)?.focus();
        return false;
      }
    }
    for (const f of [...fs.querySelectorAll<Field>('input, select, textarea')]) {
      if (f.name === 'website' || f.name === 'ts') continue;
      if (!f.checkValidity()) { f.reportValidity(); return false; }
    }
    return true;
  };

  // ───── Récapitulatif ─────
  const valueOf = (name: string): string => {
    const group = named(name);
    if (!group.length) return '';
    const first = group[0];
    if (first instanceof HTMLInputElement && (first.type === 'checkbox' || first.type === 'radio')) {
      return group
        .filter((f): f is HTMLInputElement => f instanceof HTMLInputElement && f.checked)
        .map((f) => f.dataset.label ?? f.value)
        .join(', ');
    }
    if (first instanceof HTMLSelectElement) return first.value ? first.selectedOptions[0].textContent?.trim() ?? '' : '';
    return first.value.trim();
  };
  const buildRecap = () => {
    if (!recapOut) return;
    recapOut.replaceChildren();
    for (const row of recapCfg) {
      const parts = row.fields.map((n) => { const v = valueOf(n); return v ? v + (row.units?.[n] ?? '') : ''; }).filter(Boolean);
      if (!parts.length) continue;
      const wrap = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = row.label;
      dd.textContent = parts.join(row.join ?? '\n');
      wrap.append(dt, dd);
      recapOut.append(wrap);
    }
  };
  const countEl = form.querySelector<HTMLElement>('[data-count]');
  const updateCount = () => {
    if (!countEl) return;
    const n = named('prestations[]').filter((f) => f instanceof HTMLInputElement && f.checked).length;
    countEl.textContent = n === 0 ? 'Aucune prestation choisie' : n === 1 ? '1 prestation choisie' : `${n} prestations choisies`;
  };

  // ───── Événements ─────
  form.addEventListener('input', () => { save(); updateCount(); });
  form.addEventListener('change', () => { save(); updateCount(); });
  prev.addEventListener('click', () => show(Math.max(0, current - 1)));
  next.addEventListener('click', () => { if (validateStep(current)) show(current + 1); });
  form.addEventListener('keydown', (e) => {
    // Entrée dans un champ simple : passe à l'étape suivante au lieu d'envoyer
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type !== 'checkbox' && current < steps.length - 1) {
      e.preventDefault();
      next.click();
    }
  });

  const showFailure = (msg?: string) => {
    if (!failure) return;
    failure.hidden = false;
    const m = failure.querySelector<HTMLElement>('[data-error-msg]');
    if (m && msg) m.textContent = msg;
    failure.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (failure) failure.hidden = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) { show(i, false); validateStep(i); return; }
    }
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; fields?: Record<string, string> } | null;
      if (res.ok && data?.ok) {
        try { sessionStorage.removeItem(KEY); } catch { /* ignoré */ }
        form.hidden = true;
        if (success) { success.hidden = false; success.focus(); success.scrollIntoView({ block: 'center' }); }
        return;
      }
      if (data?.error === 'validation' && data.fields) {
        const bad = Object.keys(data.fields)[0];
        const target = named(bad)[0] ?? named(`${bad}[]`)[0];
        const idx = steps.findIndex((fs) => target && fs.contains(target));
        if (idx >= 0) { show(idx, false); (target as HTMLElement).focus(); stepError(steps[idx], 'Merci de vérifier ce champ.'); }
        return;
      }
      showFailure(data?.error === 'rate' ? 'Vous avez déjà envoyé plusieurs demandes. Merci de réessayer plus tard ou de nous appeler.' : undefined);
    } catch {
      showFailure();
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
    }
  });

  show(current, false);
}

document.querySelectorAll<HTMLFormElement>('[data-quote-form]').forEach(initQuoteForm);
