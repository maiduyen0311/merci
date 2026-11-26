// Mobile bottom navigation bar (snippets/mobile-bottom-bar.liquid, user 2026-11-26 "Nhóm 2 #8").
// Menu / Search buttons are wired by mobile-drawer.js (data-mobile-drawer-open / -search-open);
// this module adds: Cart opens the cart drawer (if the theme uses one), badges hide at 0, and the
// bar slides away while scrolling down (data-hide-on-scroll) and comes back on scroll up.

const zeroBadges = (bar) => {
  bar.querySelectorAll('.mobile-bar__badge').forEach((b) => {
    b.classList.toggle('is-zero', (b.textContent || '').trim() === '0' || !(b.textContent || '').trim());
  });
};

const MobileBottomBar = {
  init() {
    const bar = document.querySelector('[data-mobile-bar]');
    if (!bar || bar.dataset.bound === '1') return;
    bar.dataset.bound = '1';

    zeroBadges(bar);
    // wishlist.js / mini-cart.js rewrite the counts → keep the "hide at 0" state in sync
    new MutationObserver(() => zeroBadges(bar)).observe(bar, { subtree: true, childList: true, characterData: true });

    const cart = bar.querySelector('[data-mobile-bar-cart]');
    if (cart) {
      cart.addEventListener('click', (e) => {
        const drawer = document.querySelector('cart-drawer');
        if (!drawer || typeof drawer.open !== 'function') return; // no drawer → /cart
        e.preventDefault();
        drawer.open(cart);
      });
    }

    if (bar.hasAttribute('data-hide-on-scroll')) {
      let last = window.scrollY;
      let ticking = false;
      const onScroll = () => {
        const y = window.scrollY;
        const down = y > last + 4 && y > 120;
        const up = y < last - 4;
        if (down) { bar.classList.add('is-hidden'); document.body.classList.add('mobile-bar-is-hidden'); }
        else if (up || y <= 120) { bar.classList.remove('is-hidden'); document.body.classList.remove('mobile-bar-is-hidden'); }
        last = y;
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
      }, { passive: true });
    }
  },
};

export default MobileBottomBar;
