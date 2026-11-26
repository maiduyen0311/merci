// Shoppable video reels (sections/mc-video-reels.liquid, user 2026-11-26 "Nhóm 2 #5").
// DEMO-ONLY feature — not shipped in the ThemeForest package (see .claude/memory/packaging-scope.md).
//
// Cards: muted clips play only while on screen (and not for prefers-reduced-motion).
// Viewer (<dialog>): the clip large with a sound toggle + progress, prev / next (buttons, arrow keys,
// swipe), and the reel's products (variant select + add to cart → closes so the cart drawer shows).

import { addToCart, toast } from './mini-cart.js';
import { formatMoney } from './money.js';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let soundOn = false;

function bind(root) {
  if (root.dataset.bound === '1') return;
  root.dataset.bound = '1';
  const format = root.dataset.moneyFormat;
  const items = [...root.querySelectorAll('[data-reel]')];
  const viewer = root.querySelector('[data-reel-viewer]');
  const stage = viewer.querySelector('[data-reel-stage]');
  const products = viewer.querySelector('[data-reel-products]');
  const sound = viewer.querySelector('[data-reel-sound]');
  const bar = viewer.querySelector('[data-reel-progress]');
  let current = -1;

  // --- cards: play while visible ------------------------------------------------------------
  const cardVideos = items.map((li) => li.querySelector('video.mc-reel__video')).filter(Boolean);
  const autoplay = root.dataset.autoplay === 'true' && !reduced();
  const visible = new Set();
  const playCard = (v) => { if (!viewer.open) v.play().catch(() => {}); };
  if (autoplay && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { visible.add(e.target); playCard(e.target); }
        else { visible.delete(e.target); e.target.pause(); }
      });
    }, { threshold: 0.5 });
    cardVideos.forEach((v) => { v.muted = true; io.observe(v); });
  }

  // --- viewer -------------------------------------------------------------------------------
  const setSound = (on) => {
    soundOn = on;
    sound.setAttribute('aria-pressed', String(on));
    const v = stage.querySelector('video');
    if (v) v.muted = !on;
  };

  const show = (i) => {
    current = (i + items.length) % items.length;
    const li = items[current];
    const src = li.querySelector('.mc-reel__video');
    stage.replaceChildren();
    if (src && src.tagName === 'VIDEO') {
      const v = src.cloneNode(true);
      v.className = '';
      v.removeAttribute('preload');
      v.muted = !soundOn;
      v.loop = true;
      v.playsInline = true;
      v.addEventListener('timeupdate', () => { if (v.duration) bar.style.width = `${(v.currentTime / v.duration) * 100}%`; });
      v.addEventListener('click', () => (v.paused ? v.play() : v.pause()));
      stage.append(v);
      v.play().catch(() => { if (!v.muted) { setSound(false); v.play().catch(() => {}); } });
    } else if (src) {
      stage.append(src.cloneNode(true));
    }
    bar.style.width = '0';
    const tpl = li.querySelector('template[data-reel-panel]');
    products.replaceChildren(tpl ? tpl.content.cloneNode(true) : '');
  };

  const open = (i) => {
    cardVideos.forEach((v) => v.pause());
    show(i);
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    document.documentElement.classList.add('mc-reels-open');
  };
  const close = () => { if (viewer.open) viewer.close(); };
  viewer.addEventListener('close', () => {
    stage.replaceChildren();
    document.documentElement.classList.remove('mc-reels-open');
    if (autoplay) visible.forEach(playCard);
    const card = items[current] && items[current].querySelector('[data-reel-open]');
    if (card) card.focus({ preventScroll: true });
  });

  root.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-reel-open]');
    if (opener && !viewer.contains(opener)) { open(items.indexOf(opener.closest('[data-reel]'))); return; }
    if (!viewer.contains(e.target)) return;
    if (e.target === viewer || e.target.closest('[data-reel-close]')) { close(); return; }
    if (e.target.closest('[data-reel-prev]')) { show(current - 1); return; }
    if (e.target.closest('[data-reel-next]')) { show(current + 1); return; }
    if (e.target.closest('[data-reel-sound]')) { setSound(!soundOn); return; }
    const add = e.target.closest('[data-reel-add]');
    if (add) {
      add.disabled = true;
      add.classList.add('is-loading');
      addToCart([{ id: Number(add.dataset.reelAdd), quantity: 1 }])
        .then(() => close())
        .catch((err) => toast(err.message))
        .finally(() => { add.disabled = false; add.classList.remove('is-loading'); });
    }
  });

  viewer.addEventListener('change', (e) => {
    const sel = e.target.closest('[data-reel-variant]');
    if (!sel) return;
    const item = sel.closest('li');
    const btn = item.querySelector('[data-reel-add]');
    if (btn) btn.dataset.reelAdd = sel.value;
    const price = item.querySelector('[data-reel-price]');
    if (price) price.textContent = formatMoney(sel.selectedOptions[0].dataset.price, format);
  });

  viewer.addEventListener('keydown', (e) => {
    if (e.target.closest('select')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); show(current + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); show(current - 1); }
  });

  // swipe on the clip (left/right or up/down, like story / reel apps)
  let start = null;
  stage.addEventListener('touchstart', (e) => { start = e.touches[0]; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.clientX;
    const dy = t.clientY - start.clientY;
    start = null;
    const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(d) > 50) show(current + (d < 0 ? 1 : -1));
  });
}

const McVideoReels = {
  init() {
    document.querySelectorAll('[data-video-reels]').forEach(bind);
  },
};

export default McVideoReels;
