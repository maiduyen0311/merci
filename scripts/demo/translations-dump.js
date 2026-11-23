#!/usr/bin/env node
// Dumps the store's translatable English content (to see what the demo translations must cover).
//   node scripts/demo/translations-dump.js --store <shop> [TYPE,TYPE] > out.json
const { execFileSync } = require('child_process');
const fs = require('fs'); const os = require('os'); const path = require('path');
const argv = process.argv.slice(2);
const store = argv[argv.indexOf('--store') + 1];
const types = (argv.find((a) => /^[A-Z_,]+$/.test(a)) || 'PRODUCT,COLLECTION,LINK,MENU,PAGE,ONLINE_STORE_THEME').split(',');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tr-'));
let n = 0;
function gql(query, variables) {
  n++; const q = path.join(tmp, `q${n}`), v = path.join(tmp, `v${n}`), o = path.join(tmp, `o${n}`);
  fs.writeFileSync(q, query); fs.writeFileSync(v, JSON.stringify(variables));
  const args = ['shopify', 'store', 'execute', '--store', store, '--query-file', q, '--variable-file', v, '--output-file', o, '--no-color'];
  execFileSync('npx', process.platform === 'win32' ? args.map((x) => (/\s/.test(x) ? `"${x}"` : x)) : args, { stdio: 'ignore', shell: process.platform === 'win32' });
  const j = JSON.parse(fs.readFileSync(o, 'utf8')); if (j.errors) throw new Error(JSON.stringify(j.errors)); return j.data || j;
}
const out = {};
for (const t of types) {
  out[t] = []; let after = null;
  do {
    const r = gql('query($t: TranslatableResourceType!, $a: String) { translatableResources(first: 100, resourceType: $t, after: $a) { pageInfo { hasNextPage endCursor } nodes { resourceId translatableContent { key value digest locale type } } } }', { t, a: after }).translatableResources;
    out[t].push(...r.nodes); after = r.pageInfo.hasNextPage ? r.pageInfo.endCursor : null;
  } while (after);
}
process.stdout.write(JSON.stringify(out, null, 1));
