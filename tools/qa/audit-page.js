(() => {
  const out = { w: innerWidth, issues: [] };
  const add = (k, d) => out.issues.push(k + ': ' + d);
  const de = document.documentElement;
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]'); };
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  // 1. débordement horizontal
  if (de.scrollWidth > innerWidth + 1) {
    const bad = [...document.body.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && r.width > 0 && vis(e) && !e.closest('[data-rail],.rail,.marquee,[class*=marquee],[class*=track]'); }).slice(0, 4).map(desc);
    add('overflow-x', `scrollWidth ${de.scrollWidth} > ${innerWidth} ; ex: ${bad.join(', ')}`);
  }
  // 2. structure
  if (document.documentElement.lang !== 'fr') add('lang', document.documentElement.lang);
  const h1 = document.querySelectorAll('h1'); if (h1.length !== 1) add('h1', h1.length);
  let prev = 0; for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) { const l = +h.tagName[1]; if (prev && l > prev + 1) add('heading-skip', `h${prev}→h${l} « ${h.textContent.trim().slice(0, 40)} »`); prev = l; }
  if (!document.querySelector('main')) add('main', 'absent');
  const ids = {}; document.querySelectorAll('[id]').forEach((e) => { ids[e.id] = (ids[e.id] || 0) + 1; }); Object.entries(ids).filter(([, n]) => n > 1).forEach(([i, n]) => add('id-dupliqué', i + ' ×' + n));
  // 3. noms accessibles
  const name = (el) => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') && [...el.getAttribute('aria-labelledby').split(' ')].map((i) => document.getElementById(i)?.textContent || '').join(' ') || el.textContent || el.getAttribute('title') || el.querySelector('img[alt]')?.alt || '').trim();
  document.querySelectorAll('a[href],button,[role=button]').forEach((e) => { if (!vis(e) && !e.matches('.sr-only')) return; if (!name(e)) add('nom-vide', desc(e) + ' ' + (e.getAttribute('href') || '')); });
  document.querySelectorAll('a[href]').forEach((e) => { if (!vis(e)) return; if (/^(cliquez ici|ici|en savoir plus|lire la suite)$/i.test(name(e))) add('lien-vague', name(e) + ' ' + e.getAttribute('href')); });
  document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea').forEach((e) => {
    if (e.closest('[hidden]') || e.getAttribute('tabindex') === '-1' && getComputedStyle(e.closest('div,p,label') || e).position === 'absolute') { /* champ piège / masqué */ }
    const lab = e.labels?.length || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.closest('label');
    if (!lab) add('champ-sans-label', desc(e) + ' name=' + e.name);
  });
  document.querySelectorAll('img').forEach((e) => { if (!e.hasAttribute('alt')) add('img-sans-alt', e.src.slice(-40)); });
  document.querySelectorAll('svg[role=img]:not([aria-label]):not([aria-labelledby])').forEach((e) => add('svg-img-sans-nom', desc(e)));
  document.querySelectorAll('[aria-hidden="true"] a[href],[aria-hidden="true"] button,[aria-hidden="true"] input').forEach((e) => { if (e.tabIndex >= 0 && !e.closest('[inert]')) add('focusable-dans-aria-hidden', desc(e)); });
  // 4. cibles tactiles (WCAG 2.2 : 24 px minimum)
  const small = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary')].filter((e) => {
    if (!vis(e)) return false; const r = e.getBoundingClientRect(); if (r.width >= 24 && r.height >= 24) return false;
    if (getComputedStyle(e).display === 'inline' && e.tagName === 'A' && e.closest('p,li,dd')) return false; // lien dans un texte : exception
    return !e.closest('.sr-only') && !e.classList.contains('skip');
  });
  if (small.length) add('cible<24px', small.length + ' ex: ' + small.slice(0, 4).map((e) => { const r = e.getBoundingClientRect(); return desc(e) + ` ${Math.round(r.width)}x${Math.round(r.height)} « ${name(e).slice(0, 20)} »`; }).join(' | '));
  // 5. contraste (approximatif : ignore les fonds image/dégradé)
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = (el) => { let layers = []; for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== 'none') return null; const c = parse(s.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; } } let base = { r: 255, g: 255, b: 255 }; for (const c of layers.reverse()) base = { r: c.r * c.a + base.r * (1 - c.a), g: c.g * c.a + base.g * (1 - c.a), b: c.b * c.a + base.b * (1 - c.a) }; return base; };
  const low = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || !vis(el) || el.closest('.sr-only,script,style,noscript,[inert]')) continue;
    const s = getComputedStyle(el); if (s.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || s.backgroundClip === 'text' || s.opacity === '0') continue;
    let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 0.5) continue;
    const fg = parse(s.color), bg = bgOf(el); if (!fg || !bg) continue;
    const f = { r: fg.r * fg.a * op + bg.r * (1 - fg.a * op), g: fg.g * fg.a * op + bg.g * (1 - fg.a * op), b: fg.b * fg.a * op + bg.b * (1 - fg.a * op) };
    const L1 = lum(f), L2 = lum(bg), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(s.fontSize), bold = +s.fontWeight >= 700, large = px >= 24 || (px >= 18.66 && bold);
    if (ratio < (large ? 3 : 4.5)) { const k = desc(el) + ' ' + ratio.toFixed(2) + ' ' + s.color + ' sur rgb(' + [bg.r, bg.g, bg.b].map(Math.round) + ')'; if (!low.has(k)) low.set(k, n.textContent.trim().slice(0, 30)); }
  }
  [...low].slice(0, 8).forEach(([k, t]) => add('contraste', k + ' « ' + t + ' »'));
  if (low.size > 8) add('contraste', '… +' + (low.size - 8) + ' autres');
  return out;
})()
