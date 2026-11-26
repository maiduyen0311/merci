// Size finder — "Find my size" (snippets/size-finder.liquid, user 2026-11-26 "Nhóm 2 #7").
//
// Table (Theme settings → Size finder): one line per size "M | 160-170 | 55-63" (height cm, weight kg).
// Each size is scored by how far the shopper's height / weight fall outside its ranges (relative to the
// range width, weight counts 1.5×); the closest wins. Fit preference moves one size down (snug) or up
// (relaxed). "Select size M" clicks that value in the product form so the variant updates as usual.

function parseTable(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.split('|').map((x) => x.trim()))
    .filter((cols) => cols.length >= 3 && cols[0])
    .map(([size, h, w]) => {
      const range = (r) => { const [a, b] = r.split(/[-–]/).map(Number); return [a, Number.isFinite(b) ? b : a]; };
      return { size, h: range(h), w: range(w) };
    })
    .filter((r) => r.h.every(Number.isFinite) && r.w.every(Number.isFinite));
}

const outside = (v, [a, b]) => {
  const span = Math.max(b - a, 1);
  if (v < a) return (a - v) / span;
  if (v > b) return (v - b) / span;
  return 0;
};

export function recommend(table, cm, kg, fit) {
  if (!table.length) return null;
  let best = 0;
  let bestScore = Infinity;
  table.forEach((row, i) => {
    // tie-break on the distance to the range centre, so "inside both ranges" prefers the middle fit
    const centre = Math.abs(cm - (row.h[0] + row.h[1]) / 2) / 100 + Math.abs(kg - (row.w[0] + row.w[1]) / 2) / 100;
    const score = outside(cm, row.h) + 1.5 * outside(kg, row.w) + centre;
    if (score < bestScore) { bestScore = score; best = i; }
  });
  const shifted = Math.min(table.length - 1, Math.max(0, best + (Number(fit) || 0)));
  return table[shifted].size;
}

function readForm(form) {
  const data = new FormData(form);
  const n = (k) => parseFloat(String(data.get(k) || '').replace(',', '.'));
  if (data.get('units') === 'imperial') {
    const ft = n('ft');
    const inch = n('in') || 0;
    const lb = n('lb');
    if (!ft || !lb) return null;
    return { cm: (ft * 12 + inch) * 2.54, kg: lb * 0.453592, fit: data.get('fit') };
  }
  const cm = n('cm');
  const kg = n('kg');
  if (!cm || !kg) return null;
  return { cm, kg, fit: data.get('fit') };
}

function bind(dialog) {
  if (dialog.dataset.bound === '1') return;
  dialog.dataset.bound = '1';
  const table = parseTable(dialog.dataset.table);
  const form = dialog.querySelector('[data-size-finder-form]');
  const result = dialog.querySelector('[data-size-finder-result]');
  const answer = dialog.querySelector('[data-size-finder-answer]');
  const select = dialog.querySelector('[data-size-finder-select]');
  const section = dialog.closest('.shopify-section') || document;
  const position = dialog.dataset.optionPosition;

  const pill = (size) => [...section.querySelectorAll(`input[name="option-${position}"]`)].find((i) => i.value === size);

  // units toggle
  form.addEventListener('change', (e) => {
    if (e.target.name !== 'units') return;
    const imperial = e.target.value === 'imperial';
    form.querySelector('[data-units-metric]').hidden = imperial;
    form.querySelector('[data-units-imperial]').hidden = !imperial;
  });
  const checked = form.querySelector('input[name="units"]:checked');
  if (checked && checked.value === 'imperial') checked.dispatchEvent(new Event('change', { bubbles: true }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = readForm(form);
    result.hidden = false;
    select.hidden = true;
    if (!input) { answer.textContent = dialog.dataset.invalid || ''; return; }
    const size = recommend(table, input.cm, input.kg, input.fit);
    if (!size) return;
    const esc = size.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    answer.innerHTML = (dialog.dataset.result || '{{ size }}').replace(/\{\{\s*size\s*\}\}/g, esc);
    const radio = pill(size);
    if (radio && !radio.disabled && !radio.closest('.is-disabled')) {
      select.textContent = (dialog.dataset.selectLabel || '').replace(/\{\{\s*size\s*\}\}/g, size);
      select.dataset.size = size;
      select.hidden = false;
    } else if (radio) {
      answer.insertAdjacentHTML('beforeend', `<br><small>${(dialog.dataset.soldOutLabel || '').replace(/\{\{\s*size\s*\}\}/g, esc)}</small>`);
    }
  });

  select.addEventListener('click', () => {
    const radio = pill(select.dataset.size);
    if (radio) radio.click();
    dialog.close();
  });

  dialog.querySelectorAll('[data-size-finder-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
  // click on the backdrop closes
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
}

const SizeFinder = {
  init() {
    document.querySelectorAll('[data-size-finder]').forEach(bind);
    if (this.bound) return;
    this.bound = true;
    document.addEventListener('click', (e) => {
      const open = e.target.closest('[data-size-finder-open]');
      if (!open) return;
      const dialog = document.getElementById(open.getAttribute('aria-controls'));
      if (!dialog) return;
      bind(dialog);
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      const first = dialog.querySelector('.size-finder__row:not([hidden]) input');
      if (first) setTimeout(() => first.focus(), 30);
    });
  },
};

export default SizeFinder;
