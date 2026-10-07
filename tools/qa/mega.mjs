// usage: node kbd.mjs <width> <route> [maxTabs]
import { spawn } from 'node:child_process';
const [W, route, MAX = '120'] = process.argv.slice(2);
const port = 9779;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/wcc-cdp-kbd`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.find((t) => t.type === 'page')) break; } catch {} await sleep(250); }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const val = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? JSON.stringify(r.result?.exceptionDetails?.exception?.description ?? r); };
await send('Emulation.setDeviceMetricsOverride', { width: Number(W), height: 900, deviceScaleFactor: 1, mobile: Number(W) < 700 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url: `http://127.0.0.1:4321${route}` });
await sleep(1800);
await val('document.body.focus(); window.scrollTo(0,0)');
const info = `(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const s=getComputedStyle(e);const r=e.getBoundingClientRect();
 const ring=(s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0)||(s.boxShadow&&s.boxShadow!=='none');
 const nm=(e.getAttribute('aria-label')||e.textContent||e.value||e.name||'').trim().slice(0,28);
 return {t:e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ')[0]:''),nm,ring,w:Math.round(r.width),h:Math.round(r.height),vis:r.width>0&&r.height>0&&s.visibility!=='hidden',href:e.getAttribute('href')||''}})()`;

const key=async(k,code,vk)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key:k,code,windowsVirtualKeyCode:vk,text:k==='Enter'?String.fromCharCode(13):undefined});await send('Input.dispatchKeyEvent',{type:'keyUp',key:k,code,windowsVirtualKeyCode:vk});await sleep(300);};
const st=`(()=>{const m=document.querySelector('[data-mega]');const a=document.activeElement;return {open:!m.hidden,exp:[...document.querySelectorAll('[data-mega-btn]')].map(b=>b.getAttribute('aria-expanded')).join(','),focus:a.tagName+'.'+(a.className||'')+' '+(a.textContent||'').trim().slice(0,25)}})()`;
await val(`document.querySelector('${process.env.BTN}').focus()`);
console.log('avant', JSON.stringify(await val(st)));
await key('Enter','Enter',13);
console.log('après Entrée', JSON.stringify(await val(st)));
await key('Tab','Tab',9);
console.log('Tab suivant', JSON.stringify(await val(st)));
await key('Escape','Escape',27);
console.log('après Échap', JSON.stringify(await val(st)));
ws.close(); chrome.kill(); process.exit(0);
