#!/usr/bin/env node
/**
 * Registers the demo's German / French translations of the store content
 * (demos/<demo>/translations.js): products (title, type, description), collections, menus,
 * pages and the text settings of the live theme's templates / header / footer.
 *
 *   node scripts/demo-translate.js merci --store <shop>.myshopify.com [--dry]
 *
 * Needs read_translations / write_translations (`shopify store auth --scopes …`) and the locales
 * published (demo-import --only languages). Safe to re-run: translations are overwritten.
 * Only values found in the dictionary are translated; the rest keeps the English fallback.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const argv = process.argv.slice(2);
const demo = argv.find((a, i) => !a.startsWith('-') && argv[i - 1] !== '--store');
const store = argv.includes('--store') ? argv[argv.indexOf('--store') + 1] : null;
const dry = argv.includes('--dry');
if (!demo || !store) { console.error('Usage: node scripts/demo-translate.js <demo> --store <shop>.myshopify.com [--dry]'); process.exit(1); }
const { T, PRODUCTS, TYPES, LOCALES, productBody } = require(path.join(ROOT, 'demos', demo, 'translations.js'));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'demo-translate-'));
let n = 0;
function gql(query, variables = {}) {
  n += 1;
  const q = path.join(tmp, `q${n}.graphql`), v = path.join(tmp, `v${n}.json`), out = path.join(tmp, `o${n}.json`);
  fs.writeFileSync(q, query); fs.writeFileSync(v, JSON.stringify(variables));
  const args = ['shopify', 'store', 'execute', '--store', store, '--query-file', q, '--variable-file', v, '--output-file', out, '--allow-mutations', '--no-color'];
  const shell = process.platform === 'win32';
  try { execFileSync('npx', shell ? args.map((x) => (/\s/.test(x) ? `"${x}"` : x)) : args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], shell, maxBuffer: 50e6 }); }
  catch (e) { throw new Error(`${(e.stdout || '').toString()}${(e.stderr || '').toString().slice(-2000)}`); }
  const json = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data || json;
}

function resources(type) {
  const all = []; let after = null;
  do {
    const r = gql('query($t: TranslatableResourceType!, $a: String) { translatableResources(first: 100, resourceType: $t, after: $a) { pageInfo { hasNextPage endCursor } nodes { resourceId translatableContent { key value digest } } } }', { t: type, a: after }).translatableResources;
    all.push(...r.nodes); after = r.pageInfo.hasNextPage ? r.pageInfo.endCursor : null;
  } while (after);
  return all;
}

// theme settings that are configuration, not copy (they must keep their English value)
const THEME_SKIP = /currency_options|option_order|hidden_filters|column_layout|video_url|_url$|\.link$/;

function translate(type, content, li) {
  const by = Object.fromEntries(content.map((c) => [c.key, c.value]));
  const out = [];
  for (const c of content) {
    const v = (c.value || '').trim();
    if (!v || c.key === 'handle') continue;
    let t = null;
    if (type === 'PRODUCT') {
      if (c.key === 'title') t = PRODUCTS[v] && PRODUCTS[v][li];
      else if (c.key === 'product_type') t = TYPES[v] && TYPES[v][li];
      else if (c.key === 'body_html' && PRODUCTS[by.title] && /^<p>The /.test(v)) t = productBody(by.product_type, by.title, li);
    } else if (type === 'ONLINE_STORE_THEME') {
      if (!c.key.startsWith('section.') || THEME_SKIP.test(c.key)) continue;
      t = T[c.value] ? T[c.value][li] : null;
    } else {
      t = T[c.value] ? T[c.value][li] : null;
    }
    if (t && t !== c.value) out.push({ key: c.key, value: t, translatableContentDigest: c.digest });
  }
  return out;
}

const totals = {};
for (const type of ['PRODUCT', 'COLLECTION', 'LINK', 'MENU', 'PAGE', 'ONLINE_STORE_THEME']) {
  const list = resources(type);
  for (const r of list) {
    for (const [li, locale] of LOCALES.entries()) {
      const tr = translate(type, r.translatableContent, li).map((x) => ({ ...x, locale }));
      if (!tr.length) continue;
      totals[`${type} ${locale}`] = (totals[`${type} ${locale}`] || 0) + tr.length;
      if (dry) continue;
      for (let i = 0; i < tr.length; i += 100) {
        const res = gql('mutation($id: ID!, $t: [TranslationInput!]!) { translationsRegister(resourceId: $id, translations: $t) { userErrors { field message } } }', { id: r.resourceId, t: tr.slice(i, i + 100) });
        const errs = res.translationsRegister.userErrors;
        if (errs.length) console.warn(`  ! ${r.resourceId} ${locale}: ${errs.map((e) => e.message).join('; ')}`);
      }
    }
  }
  console.log(`✔ ${type}: ${list.length} resources`);
}
console.log(totals);
