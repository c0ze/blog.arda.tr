import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/components/ThemeToggle.astro', import.meta.url), 'utf8');
const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
assert.match(script, /var RENDITIONS =/, 'expected the theme controls script');

function theme({ blocked = false, stored = null } = {}) {
  const classes = new Set(['night']);
  let metaColor;
  const docListeners = {};
  const summary = { focused: false, focus() { summary.focused = true; } };
  const menu = {
    open: true,
    querySelector: (selector) => (selector === 'summary' ? summary : null),
    contains: (node) => node === menu || node === summary || buttons.includes(node),
  };
  const buttons = ['night', 'night-hc', 'xerox', 'xerox-hc'].map((id) => {
    const attrs = { 'data-rendition': id };
    return {
      attrs,
      getAttribute: (name) => attrs[name],
      setAttribute: (name, value) => { attrs[name] = value; },
      addEventListener(_name, callback) { this.click = callback; },
      closest: (selector) => (selector === 'details' ? menu : null),
    };
  });
  const group = {
    hasAttribute: () => false,
    setAttribute: () => {},
    querySelectorAll: () => buttons,
  };
  vm.runInNewContext(script, {
    localStorage: {
      getItem() { if (blocked) throw new Error('Storage blocked'); return stored; },
      setItem(_key, value) { if (blocked) throw new Error('Storage blocked'); stored = value; },
    },
    document: {
      readyState: 'complete',
      documentElement: { classList: { contains: (id) => classes.has(id), add: (id) => classes.add(id), remove: (id) => classes.delete(id) } },
      querySelectorAll: (selector) => {
        if (selector === '.corner') return [group];
        if (selector === 'details.rend') return [menu];
        return buttons;
      },
      querySelector: () => ({ setAttribute: (_name, value) => { metaColor = value; } }),
      addEventListener: (name, callback) => { docListeners[name] = callback; },
    },
  });
  const fire = (name, event) => docListeners[name]?.(event);
  return { buttons, classes, menu, summary, fire, stored: () => stored, metaColor: () => metaColor };
}

test('theme changes persist and update the selected control', () => {
  const t = theme();
  t.buttons[2].click();
  assert.equal(t.stored(), 'xerox');
  assert.equal(t.buttons[2].attrs['aria-pressed'], 'true');
  assert.equal(t.metaColor(), '#efede6');
});

// A returning visitor still carries a Weekly Page id; they must land on the
// rendition with the same role (HC light stays HC light), not on the default.
test('a stored legacy rendition is read by role', () => {
  const t = theme({ stored: 'pulp-hc' });
  assert.equal(t.buttons[3].attrs['aria-pressed'], 'true');
  assert.equal(t.buttons[0].attrs['aria-pressed'], 'false');
});

test('theme controls remain usable when browser storage is blocked', () => {
  const t = theme({ blocked: true });
  assert.equal(t.buttons[0].attrs['aria-pressed'], 'true');
  t.buttons[1].click();
  assert.deepEqual([...t.classes], ['night-hc']);
  assert.equal(t.buttons[1].attrs['aria-pressed'], 'true');
  assert.equal(t.metaColor(), '#000000');
});

// The summary must announce the current rendition, not a fixed label that
// hides it; the name comes from .rend__cur (CSS), so no aria-label override.
test('the rendition switch exposes the current rendition name', () => {
  const summary = source.match(/<summary[^>]*>/)[0];
  assert.doesNotMatch(summary, /aria-label/);
  assert.match(source, /<summary[^>]*>[\s\S]*?class="rend__cur"[\s\S]*?<\/summary>/);
});

// Choosing a rendition closes the menu; keyboard focus must not be left on a
// button inside the closed panel, so it goes back to the summary.
test('choosing a rendition closes the menu and returns focus to its summary', () => {
  const t = theme();
  t.buttons[2].click();
  assert.equal(t.menu.open, false);
  assert.equal(t.summary.focused, true);
});

test('Escape closes the open menu and returns focus; an outside click closes it', () => {
  const t = theme();
  t.fire('keydown', { key: 'Escape' });
  assert.equal(t.menu.open, false);
  assert.equal(t.summary.focused, true);

  const u = theme();
  u.fire('click', { target: u.buttons[0] });
  assert.equal(u.menu.open, true, 'a click inside the menu leaves it to the buttons');
  u.fire('click', { target: {} });
  assert.equal(u.menu.open, false);
  assert.equal(u.summary.focused, false, 'an outside click does not steal focus');
});

const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
const boot_src = layout.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
assert.match(boot_src, /var RENDITIONS =/, 'expected the pre-paint theme script');

test('the pre-paint theme uses system preferences when storage is blocked', () => {
  const applied = [];
  let color;
  vm.runInNewContext(boot_src, {
    localStorage: { getItem() { throw new Error('Storage blocked'); } },
    matchMedia: () => ({ matches: true }),
    document: {
      documentElement: { classList: { add: (value) => applied.push(value) } },
      querySelector: () => ({ setAttribute: (_name, value) => { color = value; } }),
    },
  });
  assert.deepEqual(applied, ['night-hc']);
  assert.equal(color, '#000000');
});

function boot({ stored = null, prefs = {} } = {}) {
  const applied = [];
  let color;
  vm.runInNewContext(boot_src, {
    localStorage: { getItem: () => stored },
    matchMedia: (q) => ({ matches: Boolean(prefs[q]) }),
    document: {
      documentElement: { classList: { add: (value) => applied.push(value) } },
      querySelector: () => ({ setAttribute: (_name, value) => { color = value; } }),
    },
  });
  return { applied, color };
}

test('the pre-paint theme migrates legacy ids by role', () => {
  assert.deepEqual(boot({ stored: 'beta' }).applied, ['night']);
  assert.deepEqual(boot({ stored: 'pulp-hc' }).applied, ['xerox-hc']);
  assert.deepEqual(boot({ stored: 'carbon' }).applied, ['night-hc']);
});

test('the pre-paint theme follows a light system preference, else Night', () => {
  const light = boot({ prefs: { '(prefers-color-scheme: light)': true } });
  assert.deepEqual(light.applied, ['xerox']);
  assert.equal(light.color, '#efede6');
  assert.deepEqual(boot().applied, ['night']);
});
