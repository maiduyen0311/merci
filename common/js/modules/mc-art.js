// Merci layered art (snippets/mc-art.liquid): layers drift by their data-depth while the
// pointer moves over the art — pointer devices only, never with reduced motion.
// Uses the independent `translate` property, so the layers keep their own transforms.
const RANGE = 28; // px at depth 1

function bind(art) {
  if (art.dataset.mcArtBound === '1') return;
  art.dataset.mcArtBound = '1';
  const layers = [...art.querySelectorAll('[data-depth]')].map((el) => [el, Number(el.dataset.depth) || 0]);
  let frame = 0;
  const move = (x, y) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      layers.forEach(([el, d]) => { el.style.translate = `${(x * d * RANGE).toFixed(1)}px ${(y * d * RANGE).toFixed(1)}px`; });
    });
  };
  art.addEventListener('pointermove', (e) => {
    const r = art.getBoundingClientRect();
    move((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
  });
  art.addEventListener('pointerleave', () => move(0, 0));
}

export const McArt = {
  init(root = document) {
    if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    root.querySelectorAll('[data-mc-art]').forEach(bind);
  },
};
