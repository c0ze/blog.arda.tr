/*
 * The blog's only bundled script.
 *
 *   [data-scheme-toggle]  the scheme switch in the bar. src/brand/scheme.js (the
 *                         family's, a verbatim copy) pins a scheme under the
 *                         localStorage key "theme". The blog is light (bone
 *                         paper) unless the visitor pinned dark, so going back
 *                         to light clears the pin. The boot snippet in
 *                         BaseLayout applies the scheme before first paint;
 *                         this only handles the click and other tabs.
 *   a[data-key]           single-key shortcuts: a archive, / search, r rss in the bar;
 *                         l all posts and t tags on the home page.
 */
import { toggleScheme, watchScheme } from '../brand/scheme.js';

const SCHEME_KEY = 'theme';
// what the page shows with nothing pinned; the same pair as BaseLayout's bootSnippet
const SCHEME_DEFAULT = 'light';

document.querySelectorAll('[data-scheme-toggle]').forEach((button) => {
  button.addEventListener('click', () => toggleScheme(SCHEME_KEY, SCHEME_DEFAULT));
});
watchScheme(SCHEME_KEY, SCHEME_DEFAULT);

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
  const t = e.target;
  if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  const link = document.querySelector(`a[data-key="${CSS.escape(e.key)}"]`);
  if (!link) return;
  e.preventDefault();
  link.click();
});
