const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const challenges = require('./challenges.js');

test('every challenge supports the three-choice game rule and has complete feedback', () => {
  assert.equal(challenges.length, 6);
  for (const c of challenges) {
    assert.equal(c.options.length, 5, c.title);
    assert.equal(c.options.filter(o => o[1]).length, 3, c.title);
    assert.equal(new Set(c.options.map(o => o[0])).size, 5, c.title);
    for (const field of ['title', 'category', 'context', 'vague', 'mission', 'hint', 'model', 'takeaway']) assert.ok(c[field]?.trim(), `${c.title}: ${field}`);
    for (const [text, useful, explanation] of c.options) {
      assert.ok(text.trim()); assert.equal(typeof useful, 'boolean'); assert.ok(explanation.trim());
    }
  }
});
test('the offline game bundle has all linked assets', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (!match[1].startsWith('https://')) assert.ok(fs.existsSync(path.join(__dirname, match[1])), match[1]);
  }
  const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
  for (const match of css.matchAll(/url\('([^']+)'\)/g)) assert.ok(fs.existsSync(path.join(__dirname, match[1])), match[1]);
  for (const file of ['OFL-open-sans.txt', 'OFL-playfair-display.txt']) assert.ok(fs.readFileSync(path.join(__dirname, 'assets', file), 'utf8').includes('SIL OPEN FONT LICENSE'));
});
test('all script DOM targets exist and identifiers are unique', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  const script = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
  for (const match of script.matchAll(/\$\('([^']+)'\)/g)) assert.ok(ids.includes(match[1]), match[1]);
});
