// usage: node audit.mjs <width> <routes.txt> [out.json]
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const [W, routesFile, outFile] = process.argv.slice(2);
const routes = readFileSync(routesFile, 'utf8').split(/\r?\n/).filter(Boolean);
const port = 9778;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/wcc-cdp-audit`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.find((t) => t.type === 'page')) break; } catch {} await sleep(250); }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const val = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description; };
const js = readFileSync(new URL(process.env.JSF || './audit-page.js', import.meta.url), 'utf8');
const mobile = Number(W) < 700;
await send('Emulation.setDeviceMetricsOverride', { width: Number(W), height: 900, deviceScaleFactor: 1, mobile });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
const all = {};
for (const r of routes) {
  await send('Page.navigate', { url: `http://127.0.0.1:4321${r}` });
  await sleep(1400);
  all[r] = await val(js);
}
writeFileSync(outFile ?? `audit-${W}.json`, JSON.stringify(all, null, 1));
ws.close(); chrome.kill(); process.exit(0);
