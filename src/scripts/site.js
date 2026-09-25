/*
 * The blog's only bundled script. Wires the shared 1-bit engine (onebit.js, a
 * verbatim copy of design-previews/onebit/onebit.js — never fork it here) to
 * the markup:
 *
 *   canvas[data-og]        a post's OG image, dithered live. Created lazily as it
 *                          nears the viewport, so /blog never decodes 92 images on
 *                          load. data-og = image URL ("" → seeded sigil),
 *                          data-seed = the post slug, data-px, data-contrast.
 *                          With data-reveal (the post page's cover) it develops, then
 *                          the dither burns off to the real <img> underneath.
 *   [data-og-host]         hovering/focusing it tints its canvas and replays the
 *                          develop-out-of-noise.
 *   canvas[data-treeline]  the family treeline, drifting slowly.
 *   canvas[data-static]    the silence: a strip of dead-air 1-bit static.
 *   [data-clock]           JST clock in the status bar.
 *   a[data-key]            single-key shortcuts ([a]rchive, [/]search …).
 */
import { dithered, treeline, crackle, hash } from './onebit.js';

const live = [];

function wake(canvas) {
  const src = canvas.dataset.og || '';
  const frame = canvas.closest('.og');
  const reveal = 'reveal' in canvas.dataset
    ? { hold: 0.7, fade: 1.2, onDone: () => { frame?.classList.add('og--done'); canvas.hidden = true; } }
    : null;
  const fx = dithered(canvas, src, {
    px: Number(canvas.dataset.px) || 2,
    contrast: Number(canvas.dataset.contrast) || 1.25,
    fallbackSeed: hash(canvas.dataset.seed || src),
    reveal,
  });
  // the real image stays hidden until the dither has painted over it, so it never flashes first
  if (reveal) fx.ready.then(() => frame?.classList.add('og--painted'));
  live.push({ fx, canvas });
  const host = canvas.closest('[data-og-host]');
  if (!host) return;
  const on = () => { fx.hot(true); fx.develop(); };
  const off = () => fx.hot(false);
  host.addEventListener('pointerenter', on);
  host.addEventListener('pointerleave', off);
  host.addEventListener('focusin', on);
  host.addEventListener('focusout', off);
}

const canvases = document.querySelectorAll('canvas[data-og]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      wake(e.target);
    }
  }, { rootMargin: '240px 0px' });
  canvases.forEach((c) => io.observe(c));
} else {
  canvases.forEach(wake);
}

const strips = [];
document.querySelectorAll('canvas[data-treeline]').forEach((c) => {
  strips.push(treeline(c, { seed: 2, px: 2, speed: 5 }));
});
document.querySelectorAll('canvas[data-static]').forEach((c) => {
  strips.push(crackle(c, { w: 160, h: 8, density: 0.16, fps: 8 }));
});

// Canvases re-read their palette every frame, but a paused or reduced-motion
// canvas holds its last frame: repaint everything when the rendition changes.
new MutationObserver(() => {
  live.forEach(({ fx, canvas }) => fx.hot(canvas.closest('[data-og-host]')?.matches(':hover') ?? false));
  strips.forEach((s) => s.redraw());
}).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

const clocks = document.querySelectorAll('[data-clock]');
if (clocks.length) {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tick = () => clocks.forEach((el) => { el.textContent = 'JST ' + fmt.format(new Date()); el.hidden = false; });
  tick();
  setInterval(tick, 1000);
}

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
  const t = e.target;
  if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  const link = document.querySelector(`a[data-key="${CSS.escape(e.key)}"]`);
  if (!link) return;
  e.preventDefault();
  link.click();
});
