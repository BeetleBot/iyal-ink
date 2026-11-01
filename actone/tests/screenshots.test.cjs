const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'actone.js'), 'utf8');
const themeTags = [...html.matchAll(/<button class="theme-swatch"[^>]+>/g)].map(match => match[0]);
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

class Element {
  constructor() { this.dataset = {}; this.attributes = {}; this.events = {}; this.children = {}; this.textContent = ''; }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, action) { (this.events[name] ||= []).push(action); }
  querySelector(selector) { return this.children[selector]; }
  click() { this.events.click?.forEach(action => action({ target: this })); }
  showModal() { this.open = true; }
  close() { this.open = false; this.events.close?.forEach(action => action()); }
}
function loadPage() {
  const preview = new Element();
  preview.dataset.fullsize = 'assets/screenshots-4k/themes/A1-Editor-dark.png';
  preview.children.img = Object.assign(new Element(), { alt: 'ActOne screenplay editor in Classic Dark', currentSrc: 'small-preview.webp' });
  const swatches = themeTags.map(tag => {
    const button = new Element();
    button.dataset = { theme: attr(tag, 'data-theme'), themeName: attr(tag, 'data-theme-name') };
    return button;
  });
  const labels = { 'theme-preview': preview, 'theme-preview-name': new Element(), 'theme-selection-name': new Element() };
  const events = {};
  let dialog;
  const classes = new Set();
  const document = {
    currentScript: { src: 'https://example.test/actone/actone.js' },
    body: { append(value) { dialog = value; }, classList: { add: x => classes.add(x), remove: x => classes.delete(x) } },
    addEventListener(name, action) { (events[name] ||= []).push(action); },
    getElementById(id) { return labels[id]; },
    querySelectorAll(selector) { return selector === 'button.screenshot-link' ? [preview] : selector === '.theme-swatch' ? swatches : []; },
    createElement() { const el = new Element(); el.children = { img: new Element(), p: new Element(), button: new Element() }; return el; },
  };
  vm.runInNewContext(script, { document, URL, fetch: async () => ({ ok: false }) });
  events.DOMContentLoaded.forEach(action => action());
  return { preview, swatches, labels, dialog, classes };
}

test('theme swatches keep the requested order and have complete responsive assets', () => {
  assert.deepEqual(themeTags.map(tag => attr(tag, 'data-theme')), ['dark', 'light', 'catppuccin-mocha', 'catppuccin-latte', 'plum', 'sunrise', 'ocean', 'rose', 'forest', 'mint', 'berry', 'honey']);
  for (const tag of themeTags) {
    const id = attr(tag, 'data-theme');
    for (const width of [1280, 1920, 3840]) assert.ok(fs.existsSync(path.join(root, `assets/screenshots/A1-Editor-${id}-${width}.webp`)));
    assert.ok(fs.existsSync(path.join(root, `assets/screenshots-4k/themes/A1-Editor-${id}.png`)));
  }
});

test('all nine feature images open native 4K masters instead of responsive thumbnails', () => {
  const masters = [...html.matchAll(/data-fullsize="(assets\/screenshots-4k\/A1-[^"]+\.png)"/g)].map(match => match[1]);
  assert.equal(masters.length, 9);
  for (const master of masters) {
    const bytes = fs.readFileSync(path.join(root, master));
    assert.equal(bytes.readUInt32BE(16), 3840);
    assert.equal(bytes.readUInt32BE(20), 2160);
  }
  assert.ok(!html.includes('website%20images/'));
});

test('switching every theme updates the image, labels, selection, and full-size modal', () => {
  const { preview, swatches, labels, dialog, classes } = loadPage();
  for (const swatch of swatches) {
    swatch.click();
    const { theme, themeName } = swatch.dataset;
    assert.equal(labels['theme-preview-name'].textContent, themeName);
    assert.equal(labels['theme-selection-name'].textContent, themeName);
    assert.ok(preview.children.img.srcset.includes(`A1-Editor-${theme}-3840.webp 3840w`));
    assert.equal(swatches.filter(button => button.attributes['aria-pressed'] === 'true').length, 1);
    assert.equal(swatch.attributes['aria-pressed'], 'true');
    preview.click();
    assert.equal(dialog.children.img.src, `assets/screenshots-4k/themes/A1-Editor-${theme}.png`);
    assert.equal(dialog.children.img.alt, `ActOne screenplay editor in ${themeName}`);
    assert.equal(dialog.open, true);
    assert.ok(classes.has('screenshot-open'));
    dialog.children.button.click();
    assert.equal(dialog.open, false);
    assert.ok(!classes.has('screenshot-open'));
  }
});

test('the showcase includes five background cards and custom-theme guidance', () => {
  assert.equal((html.match(/class="theme-card theme-card-back /g) || []).length, 5);
  assert.ok(html.includes('Create a custom theme with your own colors.'));
  assert.ok(html.includes('save your palette') || html.includes('Save your palette'));
});

test('feature screenshots follow three writing chapters with distinct compositions', () => {
  const sections = ['build-the-world', 'work-through-the-draft', 'share-the-story'];
  const positions = sections.map(id => html.indexOf(`id="${id}"`));
  assert.ok(positions.every(position => position >= 0));
  assert.ok(positions[0] < positions[1] && positions[1] < positions[2]);
  for (const name of ['outline-composition', 'project-inset', 'canvas-spread', 'notes-composition', 'atlas-spread', 'assistant-composition', 'export-composition']) assert.ok(html.includes(name));
  assert.ok(!html.includes('class="screenshot-gallery'));
});
