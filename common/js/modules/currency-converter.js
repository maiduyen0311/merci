// Display-only currency converter (user 2026-11-23: the currency picker needs options on a store
// that has one currency — no Shopify Payments, so markets cannot add local currencies).
//
// Markup: snippets/header-top-currency.liquid renders `[data-currency-converter]` (with
// data-shop-currency, data-money-format, data-note) and `[data-convert-to]` buttons when the
// header setting "Currency converter" is on and the store has a single currency.
//
// Prices stay in the store currency in the HTML; this module rewrites the visible amounts in text
// nodes (and new ones, e.g. cart drawer, quick view, variant change) using Shopify's public rates
// (cdn.shopify.com/s/javascripts/currencies.js). Checkout is always in the store currency, so a
// note is shown in the picker and above checkout buttons while a converted currency is selected.

const STORAGE_KEY = 'mc_currency';
const RATES_URL = 'https://cdn.shopify.com/s/javascripts/currencies.js';
const SKIP = 'script, style, noscript, textarea, input, select, option, [data-no-convert], .header-top-currency';

let state = null; // { shop, target, rates, pattern, note }
const originals = new WeakMap(); // text node → original (store currency) text
let observer = null;
let applying = false;

function loadRates() {
  if (window.Currency && window.Currency.rates) return Promise.resolve(window.Currency.rates);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = RATES_URL;
    s.async = true;
    s.onload = () => (window.Currency && window.Currency.rates ? resolve(window.Currency.rates) : reject(new Error('no rates')));
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// "${{amount}}" → /\$\s?(<number>)/g ; decimal and thousands separators follow the placeholder name
function moneyPattern(format, shop) {
  const m = (format || '${{amount}}').match(/^(.*?)\{\{\s*(\w+)\s*\}\}(.*)$/);
  const [, before, key, after] = m || [null, '$', 'amount', ''];
  const comma = /comma|space/.test(key);
  const num = comma ? '\\d{1,3}(?:[. \\u00a0]\\d{3})*(?:,\\d{2})?' : "\\d{1,3}(?:[,']\\d{3})*(?:\\.\\d{2})?";
  const pre = escapeRe(before.replace(/<[^>]*>/g, '').trim());
  const post = escapeRe(after.replace(/<[^>]*>/g, '').trim());
  return {
    // "$26.44 USD" (money_with_currency format) loses the store code as well
    re: new RegExp(`${pre}\\s?(${num})${post ? `\\s?${post}` : ''}(?:\\s?${escapeRe(shop || '')}\\b)?`, 'g'),
    parse: (s) => Number(comma ? s.replace(/[.  ]/g, '').replace(',', '.') : s.replace(/[,']/g, '')),
  };
}

function formatTarget(value) {
  const lang = document.documentElement.lang || 'en';
  try {
    return new Intl.NumberFormat(lang, { style: 'currency', currency: state.target, currencyDisplay: 'narrowSymbol' }).format(value);
  } catch (e) {
    return `${value.toFixed(2)} ${state.target}`;
  }
}

function convertText(text) {
  const { rates, shop, target, pattern } = state;
  const factor = rates[shop] / rates[target];
  return text.replace(pattern.re, (match, amount) => {
    const value = pattern.parse(amount);
    return Number.isFinite(value) ? formatTarget(value * factor) : match;
  });
}

function eachTextNode(root, fn) {
  if (root.nodeType === Node.TEXT_NODE) {
    if (!root.parentElement || !root.parentElement.closest(SKIP)) fn(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE || root.closest(SKIP)) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement && n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(fn);
}

function convertNode(node) {
  const original = originals.has(node) ? originals.get(node) : node.nodeValue;
  if (!state.pattern.re.test(original)) { state.pattern.re.lastIndex = 0; return; }
  state.pattern.re.lastIndex = 0;
  originals.set(node, original);
  const next = convertText(original);
  if (node.nodeValue !== next) node.nodeValue = next;
}

function restoreAll() {
  eachTextNode(document.body, (node) => {
    if (originals.has(node)) {
      node.nodeValue = originals.get(node);
      originals.delete(node);
    }
  });
}

function notes(show) {
  document.querySelectorAll('[data-converter-generated-note]').forEach((el) => el.remove());
  document.querySelectorAll('[data-converter-note]').forEach((el) => {
    el.hidden = !show;
    if (show) el.textContent = state.note;
  });
  if (!show) return;
  document.querySelectorAll('button[name="checkout"], a[href$="/checkout"], [data-checkout-button]').forEach((btn) => {
    const p = document.createElement('p');
    p.className = 'mc-currency-note';
    p.setAttribute('data-converter-generated-note', '');
    p.setAttribute('data-no-convert', '');
    p.textContent = state.note;
    // a row of buttons (cart drawer: View cart | Check out) → the note goes above the whole row
    const parent = btn.parentElement;
    const row = parent && parent.tagName !== 'FORM' && parent.children.length > 1 && parent.children.length <= 3 && /flex|grid/.test(getComputedStyle(parent).display) ? parent : btn;
    row.insertAdjacentElement('beforebegin', p);
  });
}

function startObserver() {
  if (observer) return;
  observer = new MutationObserver((records) => {
    if (applying || !state || state.target === state.shop) return;
    applying = true;
    for (const r of records) {
      if (r.type === 'characterData') {
        // someone else wrote a new store-currency price into a node we had converted
        if (originals.has(r.target) && r.target.nodeValue !== convertText(originals.get(r.target))) originals.delete(r.target);
        convertNode(r.target);
      } else {
        r.addedNodes.forEach((n) => {
          eachTextNode(n, convertNode);
          if (n.nodeType === Node.ELEMENT_NODE && n.querySelector('button[name="checkout"], a[href$="/checkout"]')) notes(true);
        });
      }
    }
    applying = false;
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

function updatePickers(code) {
  document.querySelectorAll('[data-currency-converter]').forEach((panel) => {
    const root = panel.closest('header-top-dropdown');
    if (!root) return;
    const label = root.querySelector('[data-converter-label]');
    if (label) label.textContent = code;
    const option = panel.querySelector(`[data-convert-to="${code}"]`);
    panel.querySelectorAll('[data-convert-to]').forEach((b) => (b === option ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    const flag = root.querySelector('[data-dropdown-toggle] .header-top__flag');
    if (flag && option && option.dataset.flag) {
      if (!flag.dataset.original) flag.dataset.original = flag.currentSrc || flag.src;
      flag.removeAttribute('srcset');
      flag.src = code === panel.dataset.shopCurrency ? flag.dataset.original : option.dataset.flag;
    }
  });
}

async function apply(code) {
  const panel = document.querySelector('[data-currency-converter]');
  if (!panel) return;
  const shop = panel.dataset.shopCurrency;
  if (!code || code === shop) {
    if (state) { applying = true; restoreAll(); applying = false; }
    state = state ? { ...state, target: shop } : null;
    notes(false);
    updatePickers(shop);
    return;
  }
  let rates;
  try { rates = await loadRates(); } catch (e) { return; }
  if (!rates[code] || !rates[shop]) return;
  state = {
    shop,
    target: code,
    rates,
    pattern: moneyPattern(panel.dataset.moneyFormat, shop),
    note: (panel.dataset.note || '').replace('[currency]', code),
  };
  applying = true;
  restoreAll();
  eachTextNode(document.body, convertNode);
  applying = false;
  notes(true);
  updatePickers(code);
  startObserver();
}

const CurrencyConverter = {
  init() {
    if (!document.querySelector('[data-currency-converter]')) return;
    if (!this.bound) {
      this.bound = true;
      document.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-convert-to]');
        if (!btn) return;
        const code = btn.dataset.convertTo;
        try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* private mode */ }
        apply(code);
        const dropdown = btn.closest('header-top-dropdown');
        if (dropdown && typeof dropdown.close === 'function') dropdown.close();
      });
    }
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
    if (saved) apply(saved);
  },
};

export default CurrencyConverter;
