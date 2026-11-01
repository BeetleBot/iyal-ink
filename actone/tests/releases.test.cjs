const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const downloads = fs.readFileSync(path.join(root, 'downloads/index.html'), 'utf8');

test('website release metadata and embedded badges agree on 0.6.2', () => {
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8')).version, '0.6.2');
  for (const file of ['index.html', 'downloads/index.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(html, /data-version="badge">v0\.6\.2 Beta</);
  }
});

test('release notes show 0.6.2 without older release highlights', () => {
  assert.ok(downloads.includes('<summary>v0.6.2'));
  assert.doesNotMatch(downloads, /v0\.6\.[01]/);
  for (const item of ['Fit Page PDF Preview', 'Separate Paper Sheets', 'PDF Export Layout &amp; Scrolling', 'X-Ray Window Resizing']) {
    assert.ok(downloads.includes(item), `Missing release note: ${item}`);
  }
});
