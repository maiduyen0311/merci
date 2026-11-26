// Announcement bar (sections/announcement-bar.liquid, user 2026-11-26 "Nhóm 3 #12").
//
// Rotate mode: one message at a time (fade), auto-advance every data-interval seconds, paused while
// hovered / focused, prev / next buttons; no auto-advance for prefers-reduced-motion.
// Marquee mode: CSS animation (two copies of the messages); paused on hover in CSS.
// Countdowns, counted in the store's time zone (data-tz = shop offset at render time):
//   data-countdown-type="date"  data-countdown-end="2026-12-31 23:59"  → fixed end; when passed the
//                                message is hidden (data-countdown-expired="hide") or the timer only
//   data-countdown-type="daily" data-countdown-end="14"                 → today's 14:00, else tomorrow's
// Close button: hidden for the rest of the visit (sessionStorage).

const offsetMinutes = (tz) => {
  const m = /^([+-])(\d{2}):?(\d{2})$/.exec(tz || '');
  if (!m) return -new Date().getTimezoneOffset();
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
};

// epoch ms of the countdown end, or NaN
export function countdownEnd(type, value, tz, now = Date.now()) {
  const off = offsetMinutes(tz) * 60000;
  if (type === 'date') {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?$/.exec(String(value).trim());
    if (!m) return NaN;
    return Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 23), +(m[5] || (m[4] ? 0 : 59))) - off;
  }
  if (type === 'daily') {
    const hour = Number(value);
    if (!(hour >= 0 && hour <= 23)) return NaN;
    const store = new Date(now + off); // UTC fields = store clock
    let end = Date.UTC(store.getUTCFullYear(), store.getUTCMonth(), store.getUTCDate(), hour) - off;
    if (end <= now) end += 86400000;
    return end;
  }
  return NaN;
}

const pad = (n) => String(n).padStart(2, '0');
export function formatLeft(ms, daysLabel = 'd') {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const hms = `${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  return d > 0 ? `${d}${daysLabel} ${hms}` : hms;
}

function bind(root) {
  if (root.dataset.bound === '1') return;
  root.dataset.bound = '1';

  const key = root.dataset.dismissKey;
  try {
    if (root.hasAttribute('data-dismissible') && sessionStorage.getItem(key) === '1' && !window.Shopify?.designMode) {
      root.hidden = true;
      return;
    }
  } catch (e) { /* storage blocked */ }

  const close = root.querySelector('[data-announce-close]');
  if (close) {
    close.addEventListener('click', () => {
      root.hidden = true;
      try { sessionStorage.setItem(key, '1'); } catch (e) { /* storage blocked */ }
    });
  }

  // --- countdowns ---------------------------------------------------------------------------
  const tz = root.dataset.tz;
  const daysLabel = root.dataset.days || 'd';
  const timed = [...root.querySelectorAll('[data-countdown-type]')];
  let timer = null;
  const tick = () => {
    const now = Date.now();
    let changed = false;
    timed.forEach((item) => {
      const end = countdownEnd(item.dataset.countdownType, item.dataset.countdownEnd, tz, now);
      const span = item.querySelector('[data-announce-timer]');
      if (Number.isNaN(end)) { if (span) span.hidden = true; return; }
      const left = end - now;
      if (left <= 0 && item.dataset.countdownType === 'date') {
        if (item.dataset.countdownExpired === 'keep') { if (span) span.hidden = true; }
        else if (!item.hidden) { item.hidden = true; changed = true; }
        return;
      }
      if (span) span.textContent = formatLeft(left, daysLabel);
    });
    if (changed) refresh();
  };

  // --- rotation -----------------------------------------------------------------------------
  const slides = root.querySelector('[data-announce-slides]');
  let index = 0;
  let auto = null;
  let paused = false;
  const items = () => (slides ? [...slides.querySelectorAll('[data-announce-item]')].filter((i) => !i.hidden) : []);
  const show = (i) => {
    const list = items();
    if (!list.length) return;
    index = (i + list.length) % list.length;
    slides.querySelectorAll('[data-announce-item]').forEach((el) => el.classList.toggle('is-active', el === list[index]));
  };
  function refresh() {
    const list = items();
    if (slides && !list.length) root.hidden = true;
    root.classList.toggle('mc-announce--single', list.length < 2);
    show(index);
  }

  if (slides) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interval = Math.max(3, Number(root.dataset.interval) || 5) * 1000;
    root.querySelector('[data-announce-prev]')?.addEventListener('click', () => show(index - 1));
    root.querySelector('[data-announce-next]')?.addEventListener('click', () => show(index + 1));
    root.addEventListener('mouseenter', () => { paused = true; });
    root.addEventListener('mouseleave', () => { paused = false; });
    root.addEventListener('focusin', () => { paused = true; });
    root.addEventListener('focusout', () => { paused = false; });
    if (!reduced) auto = setInterval(() => { if (!paused && !document.hidden) show(index + 1); }, interval);

    // theme editor: selecting a block shows it and stops the rotation
    document.addEventListener('shopify:block:select', (e) => {
      const el = e.target.closest?.('[data-announce-item]');
      if (!el || !root.contains(el)) return;
      paused = true;
      const i = items().indexOf(el);
      if (i >= 0) show(i);
    });
    document.addEventListener('shopify:block:deselect', () => { paused = false; });
  }

  if (timed.length) {
    tick();
    timer = setInterval(tick, 1000);
  }
  refresh();
  root.classList.add('is-ready');

  root._mcAnnounceStop = () => { clearInterval(timer); clearInterval(auto); };
}

const AnnouncementBar = {
  init() {
    document.querySelectorAll('[data-announcement-bar]').forEach(bind);
  },
};

export default AnnouncementBar;
