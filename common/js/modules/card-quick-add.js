// Quick add on product cards (user 2026-11-25, "Nhóm 1 #1").
//
// Markup (snippets/card-product.liquid, Merci card, theme setting card_quick_add):
//   <script type="application/json" data-card-variants>[{"id":1,"o":["Blush","S"],"a":true}, …]</script>
//   [data-quick-sizes data-color-index data-size-index data-default-color]
//       > button[data-quick-size="S"]           one click = add that size in the picked colour
//   button[data-quick-color-add data-color-index data-default-color]   colour-only products
// The colour is the active colour dot (.card-product__swatch-item.is-active[data-value]),
// else the card's first available variant. Size buttons are marked sold out per colour.

import { addToCart, toast } from './mini-cart.js';

const CARD = '.card-wrapper, .product-card-wrapper, .card-product, [data-card-product]';

function variantsOf(card) {
  if (card._qaVariants) return card._qaVariants;
  const el = card.querySelector('[data-card-variants]');
  try { card._qaVariants = el ? JSON.parse(el.textContent) : []; } catch (e) { card._qaVariants = []; }
  return card._qaVariants;
}

function colourOf(card, holder) {
  const active = card.querySelector('.card-product__swatch-item.is-active[data-value]');
  return active ? active.dataset.value : holder.dataset.defaultColor || '';
}

function find(card, holder, size) {
  const ci = Number(holder.dataset.colorIndex);
  const si = Number(holder.dataset.sizeIndex);
  const colour = colourOf(card, holder);
  return variantsOf(card).find((v) => (ci < 0 || v.o[ci] === colour) && (size == null || si < 0 || v.o[si] === size));
}

// Grey out sizes that are sold out in the current colour
function refresh(card) {
  const holder = card.querySelector('[data-quick-sizes]');
  if (!holder) return;
  holder.querySelectorAll('[data-quick-size]').forEach((btn) => {
    const v = find(card, holder, btn.dataset.quickSize);
    const ok = !!(v && v.a);
    btn.disabled = !ok;
    btn.classList.toggle('is-sold-out', !ok);
  });
}

async function add(btn, variant) {
  if (!variant || !variant.a) return;
  btn.classList.add('is-loading');
  btn.setAttribute('aria-busy', 'true');
  try {
    await addToCart([{ id: variant.id, quantity: 1 }]);
  } catch (err) {
    toast(err.message);
  } finally {
    btn.classList.remove('is-loading');
    btn.removeAttribute('aria-busy');
  }
}

function onClick(e) {
  const sizeBtn = e.target.closest('[data-quick-size]');
  const colourBtn = !sizeBtn && e.target.closest('[data-quick-color-add]');
  if (sizeBtn || colourBtn) {
    e.preventDefault();
    e.stopPropagation();
    const btn = sizeBtn || colourBtn;
    const card = btn.closest(CARD);
    if (!card) return;
    const holder = sizeBtn ? btn.closest('[data-quick-sizes]') : btn;
    add(btn, find(card, holder, sizeBtn ? btn.dataset.quickSize : null));
    return;
  }
  // a colour dot was picked → update which sizes are available
  const dot = e.target.closest('.card-product__swatch-item');
  if (dot) {
    const card = dot.closest(CARD);
    if (card) setTimeout(() => refresh(card), 0);
  }
}

const CardQuickAdd = {
  init() {
    document.querySelectorAll('[data-quick-sizes]').forEach((holder) => {
      const card = holder.closest(CARD);
      if (card) refresh(card);
    });
    if (this.bound) return;
    this.bound = true;
    // capture: runs before the card link / other card handlers
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const dot = e.target.closest && e.target.closest('.card-product__swatch-item');
      const card = dot && dot.closest(CARD);
      if (card) setTimeout(() => refresh(card), 0);
    });
  },
};

export default CardQuickAdd;
