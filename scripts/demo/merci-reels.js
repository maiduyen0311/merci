#!/usr/bin/env node
/**
 * Merci demo — "Shoppable video reels" clips (user 2026-11-26, Nhóm 2 #5, DEMO-ONLY feature).
 *
 *   node scripts/demo/merci-reels.js --store merci-demo.myshopify.com
 *
 * Downloads the 720p renditions of six portrait Pexels clips (Pexels License: free for commercial
 * use, no attribution required — credited in design/IMAGE-CREDITS.md anyway) into
 * demos/merci/videos/ (git-ignored, re-downloaded on demand), uploads each to Files as a VIDEO
 * (staged upload) and waits until Shopify has processed it. Files are found by filename, so a run
 * only uploads what is missing. Section settings reference them as shopify://files/videos/<name>.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DIR = path.join(ROOT, 'demos', 'merci', 'videos');
const argv = process.argv.slice(2);
const store = argv[argv.indexOf('--store') + 1];
if (!argv.includes('--store') || !store) { console.error('Usage: node scripts/demo/merci-reels.js --store <shop>.myshopify.com'); process.exit(1); }

// Pexels id → rendition (portrait, ~720p) and the filename used on Shopify
const CLIPS = [
  { name: 'merci-reel-tote.mp4', id: 6787272, file: '6787272-hd_720_1280_30fps.mp4', alt: 'Holding a canvas tote on a pink backdrop' },
  // 30706004 (city walk) was dropped: Shopify read its duration as 0 s (VIDEO_MIN_DURATION_ERROR)
  { name: 'merci-reel-bucket.mp4', id: 8994980, file: '8994980-hd_720_1280_25fps.mp4', alt: 'Bucket hat and a light jacket' },
  { name: 'merci-reel-sea.mp4', id: 18899013, file: '18899013-hd_720_1280_60fps.mp4', alt: 'Long green dress on a windy beach' },
  { name: 'merci-reel-coat.mp4', id: 7762513, file: '7762513-hd_720_1366_25fps.mp4', alt: 'Camel coat in the studio' },
  { name: 'merci-reel-pleats.mp4', id: 3454830, file: '3454830-hd_1080_2048_25fps.mp4', alt: 'Pleated skirt swirling' },
  { name: 'merci-reel-straw.mp4', id: 8362273, file: '8362273-hd_720_1366_25fps.mp4', alt: 'Wide straw hat by the sea' },
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'merci-reels-'));
let n = 0;
function gql(query, variables = {}) {
  n += 1;
  const q = path.join(tmp, `q${n}.graphql`);
  const v = path.join(tmp, `v${n}.json`);
  const out = path.join(tmp, `o${n}.json`);
  fs.writeFileSync(q, query);
  fs.writeFileSync(v, JSON.stringify(variables));
  const args = ['shopify', 'store', 'execute', '--store', store, '--query-file', q, '--variable-file', v, '--output-file', out, '--allow-mutations', '--no-color'];
  const shell = process.platform === 'win32';
  const argv2 = shell ? args.map((x) => (/\s/.test(x) ? `"${x}"` : x)) : args;
  try {
    execFileSync('npx', argv2, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], shell, maxBuffer: 50e6 });
  } catch (e) {
    throw new Error(`GraphQL call failed:\n${(e.stdout || '').toString()}${(e.stderr || '').toString().slice(-2000)}`);
  }
  const json = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data || json;
}
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const find = (filename) => {
  const r = gql('query($q: String!) { files(first: 5, query: $q) { nodes { id fileStatus ... on Video { filename duration } } } }', { q: `filename:${filename}` });
  return r.files.nodes.find((x) => x.filename === filename) || null;
};

fs.mkdirSync(DIR, { recursive: true });
for (const c of CLIPS) {
  const abs = path.join(DIR, c.name);
  let node = find(c.name);
  if (!node) {
    if (!fs.existsSync(abs)) {
      console.log(`↓ ${c.name} (pexels ${c.id})`);
      execFileSync('curl', ['-s', '-f', '-L', '-o', abs, `https://videos.pexels.com/video-files/${c.id}/${c.file}`]);
    }
    const size = fs.statSync(abs).size;
    const staged = gql('mutation($input: [StagedUploadInput!]!) { stagedUploadsCreate(input: $input) { stagedTargets { url resourceUrl parameters { name value } } userErrors { field message } } }', {
      input: [{ resource: 'VIDEO', filename: c.name, mimeType: 'video/mp4', httpMethod: 'POST', fileSize: String(size) }],
    }).stagedUploadsCreate.stagedTargets[0];
    const form = staged.parameters.flatMap((p) => ['-F', `${p.name}=${p.value}`]).concat(['-F', `file=@${abs};type=video/mp4`]);
    execFileSync('curl', ['-s', '-f', '-o', process.platform === 'win32' ? 'NUL' : '/dev/null', ...form, staged.url]);
    const r = gql('mutation($files: [FileCreateInput!]!) { fileCreate(files: $files) { files { id } userErrors { field message } } }', {
      files: [{ originalSource: staged.resourceUrl, filename: c.name, contentType: 'VIDEO', alt: c.alt }],
    });
    if (r.fileCreate.userErrors.length) throw new Error(`${c.name}: ${JSON.stringify(r.fileCreate.userErrors)}`);
    console.log(`↑ ${c.name}`);
  }
  for (let i = 0; i < 60 && !(node && node.fileStatus === 'READY'); i++) { sleep(4000); node = find(c.name); }
  console.log(`${node && node.fileStatus === 'READY' ? '✔' : '✖'} ${c.name} ${node ? node.fileStatus : 'missing'} → shopify://files/videos/${c.name}`);
}
