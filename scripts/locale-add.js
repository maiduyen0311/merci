#!/usr/bin/env node
/**
 * Add translation keys to every storefront locale (locales/*.json, not *.schema.json).
 * Existing values are never overwritten, so the script is safe to re-run.
 *
 *   node scripts/locale-add.js keys.json
 *
 * keys.json: { "sections.main_product.availability": { "en": "Availability", "vi": "Tình trạng" } }
 * Locales without their own value get the "en" text (theme check MatchingTranslations needs the key).
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'locales');
const keys = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.includes('.schema.'))) {
  const p = path.join(dir, file);
  let raw = fs.readFileSync(p, 'utf8');
  let bom = '';
  if (raw.charCodeAt(0) === 0xfeff) {
    bom = '﻿';
    raw = raw.slice(1);
  }
  // keep Shopify's "auto-generated" comment header
  let head = '';
  const m = raw.match(/^\s*\/\*[\s\S]*?\*\/\s*/);
  if (m) {
    head = m[0];
    raw = raw.slice(m[0].length);
  }
  const json = JSON.parse(raw);
  const lang = file.split('.')[0];
  let changed = false;
  for (const [key, values] of Object.entries(keys)) {
    const parts = key.split('.');
    let node = json;
    for (const k of parts.slice(0, -1)) node = node[k] = node[k] || {};
    const last = parts[parts.length - 1];
    if (node[last] === undefined) {
      node[last] = values[lang] ?? values.en;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(p, bom + head + JSON.stringify(json, null, 2) + '\n');
}
console.log('locale keys added');
