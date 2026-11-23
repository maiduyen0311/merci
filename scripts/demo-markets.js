#!/usr/bin/env node
/**
 * Demo markets so the header currency picker has options (user 2026-11-23: "about 5 options").
 *   node scripts/demo-markets.js --store <shop>.myshopify.com
 * Creates (or updates) one region market per currency, with local currency pricing on.
 * Needs the read_markets / write_markets scopes (`shopify store auth --scopes …`).
 * Safe to re-run: markets are looked up by handle.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const argv = process.argv.slice(2);
const store = argv[argv.indexOf('--store') + 1];
if (!store || argv.indexOf('--store') < 0) { console.error('Usage: node scripts/demo-markets.js --store <shop>.myshopify.com'); process.exit(1); }

const MARKETS = [
  { handle: 'demo-eu', name: 'Europe', currency: 'EUR', countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI'] },
  { handle: 'demo-uk', name: 'United Kingdom', currency: 'GBP', countries: ['GB'] },
  { handle: 'demo-ca', name: 'Canada', currency: 'CAD', countries: ['CA'] },
  { handle: 'demo-au', name: 'Australia', currency: 'AUD', countries: ['AU'] },
  { handle: 'demo-jp', name: 'Japan', currency: 'JPY', countries: ['JP'] },
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'demo-markets-'));
let n = 0;
function gql(query, variables = {}) {
  n += 1;
  const q = path.join(tmp, `q${n}.graphql`), v = path.join(tmp, `v${n}.json`), out = path.join(tmp, `o${n}.json`);
  fs.writeFileSync(q, query); fs.writeFileSync(v, JSON.stringify(variables));
  const args = ['shopify', 'store', 'execute', '--store', store, '--query-file', q, '--variable-file', v, '--output-file', out, '--allow-mutations', '--no-color'];
  const shell = process.platform === 'win32';
  try { execFileSync('npx', shell ? args.map((x) => (/\s/.test(x) ? `"${x}"` : x)) : args, { stdio: ['ignore', 'pipe', 'pipe'], shell }); }
  catch (e) { throw new Error(`${(e.stdout || '').toString()}${(e.stderr || '').toString().slice(-2000)}`); }
  const json = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data || json;
}
const report = (r, label) => {
  const errs = Object.values(r).flatMap((x) => (x && x.userErrors) || []);
  console.log(errs.length ? `  ! ${label}: ${errs.map((e) => `${e.field || ''} ${e.message}`).join('; ')}` : `✔ ${label}`);
};

const existing = gql('{ markets(first: 50) { nodes { id handle } } }').markets.nodes;
for (const m of MARKETS) {
  const found = existing.find((x) => x.handle === m.handle);
  const input = {
    name: m.name,
    handle: m.handle,
    status: 'ACTIVE',
    conditions: { regionsCondition: { regions: m.countries.map((countryCode) => ({ countryCode })) } },
    currencySettings: { baseCurrency: m.currency, localCurrencies: true },
  };
  if (found) {
    const { handle, conditions, ...update } = input; // regions are only set on create
    report(gql('mutation($id: ID!, $i: MarketUpdateInput!) { marketUpdate(id: $id, input: $i) { market { id } userErrors { field message } } }', { id: found.id, i: update }), `${m.name} (${m.currency}) updated`);
  } else {
    report(gql('mutation($i: MarketCreateInput!) { marketCreate(input: $i) { market { id } userErrors { field message } } }', { i: input }), `${m.name} (${m.currency}) created`);
  }
}
console.log('presentment currencies:', gql('{ shop { enabledPresentmentCurrencies } }').shop.enabledPresentmentCurrencies.join(', '));
