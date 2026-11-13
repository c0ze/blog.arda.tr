/**
 * Rehype steps for post bodies (wired in astro.config.mjs). Plain JS so the
 * tests can import them without Astro. They run after `rehype-raw`, so raw
 * HTML in the markdown (<img>, <iframe>, <video>) is already a hast element.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { imageMetadata } from 'astro/assets/utils';

function walk(node, visit) {
  for (const child of node.children ?? []) {
    if (child.type === 'element') visit(child);
    walk(child, visit);
  }
}

function contains(node, target) {
  for (const child of node.children ?? []) {
    if (child === target || contains(child, target)) return true;
  }
  return false;
}

/**
 * The page title is the post's only h1. A post whose body opens its outline
 * with `# ` gets every body heading moved down one level (h1→h2 … h5→h6), so
 * the outline keeps its order under the title instead of competing with it.
 * A post whose outline starts lower and only later uses `# ` keeps its other
 * headings; just its h1s become h2s (shifting everything would push its
 * opening h2s to h3). Posts without a body h1 are left exactly as written.
 */
export function rehypeDemoteHeadings() {
  return (tree) => {
    let first;
    let hasH1 = false;
    walk(tree, (el) => {
      if (!/^h[1-6]$/.test(el.tagName)) return;
      first ??= el.tagName;
      if (el.tagName === 'h1') hasH1 = true;
    });
    if (!hasH1) return;
    const shiftAll = first === 'h1';
    walk(tree, (el) => {
      const m = /^h([1-5])$/.exec(el.tagName);
      if (!m) return;
      if (shiftAll) el.tagName = `h${Number(m[1]) + 1}`;
      else if (el.tagName === 'h1') el.tagName = 'h2';
    });
  };
}

/** Intrinsic size of an image under public/, or null (remote, missing, unreadable). */
export async function localImageSize(src, publicDir) {
  if (typeof src !== 'string' || !src.startsWith('/') || src.startsWith('//')) return null;
  try {
    const file = path.join(publicDir, decodeURI(src.split(/[?#]/)[0]));
    if (!file.startsWith(publicDir + path.sep)) return null;
    const { width, height } = await imageMetadata(await readFile(file), src);
    return { width, height };
  } catch {
    return null;
  }
}

/**
 * Body media load lazily: `loading="lazy" decoding="async"` on images and
 * `loading="lazy"` on iframes. A local image (under public/) also gets its
 * width/height from the file, so the column reserves its space. The one
 * exception is an image that opens the post body: it may be the largest
 * paint above the fold on a phone, so it stays eager.
 */
export function rehypeMediaLoading({ publicDir = path.join(process.cwd(), 'public') } = {}) {
  return async (tree) => {
    const opening = (tree.children ?? []).find((n) => n.type === 'element');
    let first = true;
    const pending = [];
    walk(tree, (el) => {
      if (el.tagName === 'iframe') {
        el.properties.loading ??= 'lazy';
        return;
      }
      if (el.tagName !== 'img') return;
      const eager = first && opening !== undefined && (opening === el || contains(opening, el));
      first = false;
      if (!eager) el.properties.loading ??= 'lazy';
      el.properties.decoding ??= 'async';
      if (el.properties.width == null && el.properties.height == null) {
        pending.push(localImageSize(el.properties.src, publicDir).then((size) => {
          if (size) Object.assign(el.properties, size);
        }));
      }
    });
    await Promise.all(pending);
  };
}
