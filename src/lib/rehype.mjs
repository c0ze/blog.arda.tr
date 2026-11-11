/**
 * Rehype steps for post bodies (wired in astro.config.mjs). Plain JS so the
 * tests can import them without Astro. They run after `rehype-raw`, so raw
 * HTML in the markdown (<img>, <iframe>, <video>) is already a hast element.
 */
function walk(node, visit) {
  for (const child of node.children ?? []) {
    if (child.type === 'element') visit(child);
    walk(child, visit);
  }
}

/**
 * The page title is the post's only h1. A post that uses `# ` in its body
 * gets every body heading moved down one level (h1→h2 … h5→h6), so the
 * outline keeps its order under the title instead of competing with it.
 * Posts without a body h1 are left exactly as written.
 */
export function rehypeDemoteHeadings() {
  return (tree) => {
    let hasH1 = false;
    walk(tree, (el) => { if (el.tagName === 'h1') hasH1 = true; });
    if (!hasH1) return;
    walk(tree, (el) => {
      const m = /^h([1-5])$/.exec(el.tagName);
      if (m) el.tagName = `h${Number(m[1]) + 1}`;
    });
  };
}
