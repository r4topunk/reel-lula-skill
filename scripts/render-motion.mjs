// Render a MOTION-contract piece (motion3/BRIEF.md) to MP4: H.264 + AAC, 60 fps, no motion-blur subframes.
//   node render-motion.mjs <dir containing index.html> <out.mp4>            full render
//   node render-motion.mjs <dir> <stillsDir> --stills 0,1.5,4.2             JPEG stills at those times (s)
// Env: CHROME=<path do Chrome> W=1440 H=1080 FPS=60 LUFS=-12 (loudness of the final mix), OVERLAY=<css selector to hide> (default: heuristic).
// Contract: window.MOTION = { duration, seek(t), renderAudio(): Promise<AudioBuffer> }.
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { extname, join, resolve, dirname, basename } from 'node:path';

const [dirArg, out, flag, list] = process.argv.slice(2);
if (!dirArg || !out) { console.error('usage: node render-motion.mjs <dir> <out.mp4> | <dir> <stillsDir> --stills t1,t2'); process.exit(1); }
const dir = resolve(dirArg), ROOT = dirname(dir), PAGE = basename(dir);
const W = +(process.env.W || 1440), H = +(process.env.H || 1080), FPS = +(process.env.FPS || 60), LUFS = process.env.LUFS || -12;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain', '.json': 'application/json', '.svg': 'image/svg+xml' };
// Static server rooted one level up, so ../assets/ resolves. Supports Range (needed for <video> seeking).
const srv = http.createServer(async (q, r) => {
  const p = join(ROOT, decodeURIComponent(q.url.split('?')[0])); let d;
  try { d = await readFile(p); } catch { if (!q.url.includes('favicon')) console.log('404', q.url); r.writeHead(404); return r.end(); }
  const type = MIME[extname(p)] || 'application/octet-stream', m = /bytes=(\d*)-(\d*)/.exec(q.headers.range || '');
  if (m) { const a = m[1] ? +m[1] : 0, b = m[2] ? +m[2] : d.length - 1;
    r.writeHead(206, { 'content-type': type, 'content-range': `bytes ${a}-${b}/${d.length}`, 'accept-ranges': 'bytes', 'content-length': b - a + 1 }); return r.end(d.subarray(a, b + 1)); }
  r.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': d.length }); r.end(d);
});
await new Promise(r => srv.listen(0, r)); const port = srv.address().port;
const br = await puppeteer.launch({ protocolTimeout: 600000, executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--force-color-profile=srgb', '--autoplay-policy=no-user-gesture-required'] });
const p = await br.newPage(); await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
const errors = [];
p.on('pageerror', e => errors.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text()); });
// While capturing, drop the page's own rAF loop so nothing redraws between seek(t) and the screenshot.
await p.evaluateOnNewDocument(() => { const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => window.__CAPTURE ? 0 : raf(cb);
  // re-seeking a <video> to the time it already shows would restart the seek and drop the frame: make it a no-op
  const d = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
  Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', { get() { return d.get.call(this); },
    set(v) { if (window.__CAPTURE && !this.seeking && Math.abs(v - d.get.call(this)) < 0.0005) return; d.set.call(this, v); }, configurable: true }); });
const step = m => process.env.DEBUG && console.log('·', m);
await p.goto(`http://127.0.0.1:${port}/${PAGE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 120000 }); step('dom');
// 'load' can hang forever when a <video> keeps seeking; give it 15 s, then go on
await p.evaluate(() => new Promise(r => { if (document.readyState === 'complete') return r(); addEventListener('load', r); setTimeout(r, 15000); })); step('loaded');
await p.waitForFunction(() => window.MOTION && typeof window.MOTION.seek === 'function', { timeout: 60000 }); step('MOTION found');
await p.evaluate(() => Promise.race([document.fonts ? document.fonts.ready.then(() => 1) : 1, new Promise(r => setTimeout(r, 8000))])); step('fonts');
const dur = await p.evaluate(() => +window.MOTION.duration || 10);
const hidden = await p.evaluate(sel => { window.__CAPTURE = true;
  const cands = sel ? [...document.querySelectorAll(sel)] : [...document.querySelectorAll('[id*=play i],[class*=play i],[id*=overlay i],[class*=overlay i],[id*=start i],[class*=start i]')]
    .filter(e => !e.closest('canvas') && e.tagName !== 'SCRIPT');
  cands.forEach(e => e.style.setProperty('display', 'none', 'important')); document.body.style.cursor = 'none';
  return cands.map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').join('.') : '')); }, process.env.OVERLAY || '');
console.log('piece', PAGE, 'duration', dur, 's · hid', hidden.length ? hidden.join(', ') : 'nothing');
const seek = t => p.evaluate(async t => { await window.MOTION.seek(t);
  const vids = [...document.querySelectorAll('video')];            // wait for any <video> the piece seeked, then draw again
  if (vids.length) { const t0 = performance.now(); while (vids.some(v => v.seeking || v.readyState < 2) && performance.now() - t0 < 3000) await new Promise(r => setTimeout(r, 5)); await window.MOTION.seek(t); }
}, t);
const shot = async t => { await seek(t); return p.screenshot({ type: 'jpeg', quality: 95, optimizeForSpeed: true, clip: { x: 0, y: 0, width: W, height: H } }); };
if (flag === '--stills') {
  await mkdir(out, { recursive: true });
  for (const t of (list || '0,2,4,6,8').split(',').map(Number)) await writeFile(join(out, `t${t.toFixed(2)}.jpg`), await shot(t));
} else {
  // audio: renderAudio() → 16-bit WAV
  const wavB64 = await p.evaluate(async () => { const b = await window.MOTION.renderAudio(); const ch = b.numberOfChannels, n = b.length, sr = b.sampleRate;
    const buf = new ArrayBuffer(44 + n * ch * 2), v = new DataView(buf), w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n * ch * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * ch * 2, true);
    const data = [...Array(ch)].map((_, c) => b.getChannelData(c)); let o = 44, peak = 0;
    for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { const s = Math.max(-1, Math.min(1, data[c][i])); peak = Math.max(peak, Math.abs(s)); v.setInt16(o, s * 32767, true); o += 2; }
    let bin = ''; const u8 = new Uint8Array(buf); for (let i = 0; i < u8.length; i += 32768) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 32768));
    return JSON.stringify({ b64: btoa(bin), peak, sr, ch, secs: n / sr }); });
  const A = JSON.parse(wavB64), wav = out.replace(/\.mp4$/, '') + '.score.wav';
  await writeFile(wav, Buffer.from(A.b64, 'base64')); console.log('audio', A.secs.toFixed(2) + 's', A.sr + 'Hz', A.ch + 'ch', 'peak', A.peak.toFixed(2));
  const frames = Math.round(dur * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', wav,
    '-af', `loudnorm=I=${LUFS}:TP=-1.0:LRA=9`, '-ar', '48000', '-c:a', 'aac', '-b:a', '320k',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-t', String(dur), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) { const buf = await shot(f / FPS); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 120 === 0) console.log('frame', f, '/', frames, ((Date.now() - t0) / 1000).toFixed(0) + 's'); }
  ff.stdin.end(); await new Promise((r, j) => ff.on('close', c => c ? j(new Error('ffmpeg exit ' + c)) : r()));
}
if (errors.length) console.log('page errors (' + errors.length + '):\n  ' + [...new Set(errors)].slice(0, 8).join('\n  '));
await br.close(); srv.close(); console.log('done', out);
