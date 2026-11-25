// Cart drawer recommendations with quick add (user 2026-11-25, "Nhóm 1 #2").
//
// Markup: snippets/cart-drawer.liquid → <cart-upsell data-product-id data-exclude data-limit data-url …>.
// Asks Shopify's product recommendations for the last item added: complementary products first
// (set in the Search & Discovery app), then related ones; skips what is already in the cart.
// The drawer is re-rendered after every cart change, so results are cached per product.

import { addToCart, toast } from './mini-cart.js';
import { formatMoney } from './money.js';

const cache = new Map();

async function fetchProducts(url, productId, intent, limit) {
  const key = `${url}|${productId}|${intent}`;
  if (!cache.has(key)) {
    cache.set(key, fetch(`${url}.json?product_id=${productId}&limit=${limit}&intent=${intent}`)
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((j) => j.products || [])
      .catch(() => []));
  }
  return cache.get(key);
}

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const imageUrl = (src, width) => {
  if (!src) return '';
  const u = src.startsWith('//') ? `https:${src}` : src;
  return `${u}${u.includes('?') ? '&' : '?'}width=${width}`;
};

class CartUpsell extends HTMLElement {
  async connectedCallback() {
    const { productId, url } = this.dataset;
    if (!productId || !url) return;
    const limit = Number(this.dataset.limit) || 3;
    const exclude = new Set((this.dataset.exclude || '').split(',').filter(Boolean).map(Number));
    const pick = (list) => list.filter((p) => !exclude.has(p.id) && p.available);

    let products = pick(await fetchProducts(url, productId, 'complementary', 10));
    if (products.length < limit) {
      const related = pick(await fetchProducts(url, productId, 'related', 10));
      products = products.concat(related.filter((p) => !products.some((x) => x.id === p.id)));
    }
    products = products.slice(0, limit);
    if (!products.length || !this.isConnected) return;

    const list = this.querySelector('[data-upsell-list]');
    list.innerHTML = products.map((p) => this.card(p)).join('');
    this.hidden = false;
    list.addEventListener('click', (e) => this.onAdd(e));
    list.addEventListener('change', (e) => this.onVariant(e));
  }

  card(p) {
    const format = this.dataset.moneyFormat;
    const variants = (p.variants || []).filter((v) => v.available);
    const first = variants[0];
    const img = p.featured_image ? `<img src="${esc(imageUrl(p.featured_image, 160))}" alt="" width="64" height="80" loading="lazy">` : '';
    const select = variants.length > 1
      ? `<select class="mini-cart__upsell-select" data-upsell-variant aria-label="${esc(p.title)}">${variants.map((v) => `<option value="${v.id}" data-price="${v.price}">${esc(v.title)}</option>`).join('')}</select>`
      : '';
    return `<li class="mini-cart__upsell-item">
      <a class="mini-cart__upsell-media" href="${esc(p.url)}" tabindex="-1" aria-hidden="true">${img}</a>
      <div class="mini-cart__upsell-info">
        <a class="mini-cart__upsell-title" href="${esc(p.url)}">${esc(p.title)}</a>
        <span class="mini-cart__upsell-price" data-upsell-price>${esc(formatMoney(first ? first.price : p.price, format))}</span>
        ${select}
      </div>
      <button type="button" class="mini-cart__upsell-add" data-upsell-add="${first ? first.id : ''}" aria-label="${esc(`${this.dataset.addLabel}: ${p.title}`)}">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>
      </button>
    </li>`;
  }

  onVariant(e) {
    const select = e.target.closest('[data-upsell-variant]');
    if (!select) return;
    const item = select.closest('.mini-cart__upsell-item');
    const option = select.selectedOptions[0];
    item.querySelector('[data-upsell-add]').dataset.upsellAdd = select.value;
    item.querySelector('[data-upsell-price]').textContent = formatMoney(option.dataset.price, this.dataset.moneyFormat);
  }

  async onAdd(e) {
    const btn = e.target.closest('[data-upsell-add]');
    if (!btn || !btn.dataset.upsellAdd) return;
    btn.disabled = true;
    btn.classList.add('is-loading');
    try {
      await addToCart([{ id: Number(btn.dataset.upsellAdd), quantity: 1 }]); // re-renders the drawer
    } catch (err) {
      toast(err.message);
      btn.disabled = false;
      btn.classList.remove('is-loading');
    }
  }
}

const CartUpsellModule = {
  init() {
    if (!customElements.get('cart-upsell')) customElements.define('cart-upsell', CartUpsell);
  },
};

export default CartUpsellModule;
