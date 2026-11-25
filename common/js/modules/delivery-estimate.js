// Calculated delivery dates on the product page (user 2026-11-25, "Nhóm 1 #4").
//
// Markup (sections/main-product.liquid, delivery_mode = dynamic):
//   <li data-delivery-estimate data-min="3" data-max="5" data-cutoff="14" data-weekends="false"
//       data-tz="+0700" data-cutoff-text="Order within [time] to ship today" data-ships-text="Ships [day]">
//     … <span data-delivery-dates>fallback text</span> <span data-delivery-cutoff hidden></span>
//
// Everything is counted in the store's time zone (data-tz is the shop offset at render time):
// an order placed before the cut-off on a dispatch day ships today, otherwise on the next dispatch
// day; delivery = dispatch day + min…max business days (weekends skipped unless data-weekends).

const offsetMinutes = (tz) => {
  const m = /^([+-])(\d{2}):?(\d{2})$/.exec(tz || '');
  if (!m) return -new Date().getTimezoneOffset();
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
};

// "store clock": a Date whose UTC fields hold the store's local date/time
const storeNow = (tz) => new Date(Date.now() + offsetMinutes(tz) * 60000);

const isWorkday = (d, weekends) => weekends || (d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

function addWorkdays(date, days, weekends) {
  const d = new Date(date);
  let left = days;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (isWorkday(d, weekends)) left -= 1;
  }
  return d;
}

function dispatchDay(now, cutoff, weekends) {
  const d = new Date(now);
  const beforeCutoff = cutoff > 0 && now.getUTCHours() < cutoff;
  if (isWorkday(d, weekends) && beforeCutoff) return { day: d, today: true };
  do { d.setUTCDate(d.getUTCDate() + 1); } while (!isWorkday(d, weekends));
  return { day: d, today: false };
}

const lang = () => document.documentElement.lang || 'en';
const fmt = (d, opts) => new Intl.DateTimeFormat(lang(), { timeZone: 'UTC', ...opts }).format(d);

function render(el) {
  const min = Number(el.dataset.min) || 0;
  const max = Math.max(min, Number(el.dataset.max) || 0);
  const cutoff = Number(el.dataset.cutoff) || 0;
  const weekends = el.dataset.weekends === 'true';
  const now = storeNow(el.dataset.tz);
  const { day, today } = dispatchDay(now, cutoff, weekends);

  const from = addWorkdays(day, min, weekends);
  const to = addWorkdays(day, max, weekends);
  const dayFmt = { weekday: 'short', month: 'short', day: 'numeric' };
  const dates = el.querySelector('[data-delivery-dates]');
  if (dates) dates.textContent = min === max ? fmt(from, dayFmt) : `${fmt(from, dayFmt)} – ${fmt(to, dayFmt)}`;

  const note = el.querySelector('[data-delivery-cutoff]');
  if (!note) return;
  let text = '';
  if (today) {
    const left = cutoff * 60 - (now.getUTCHours() * 60 + now.getUTCMinutes());
    const h = Math.floor(left / 60);
    const m = left % 60;
    const time = h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
    text = (el.dataset.cutoffText || '').replace('[time]', time);
  } else if (el.dataset.shipsText) {
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const sameDay = (a, b) => a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
    let label;
    try {
      label = sameDay(day, tomorrow)
        ? new Intl.RelativeTimeFormat(lang(), { numeric: 'auto' }).format(1, 'day')
        : fmt(day, { weekday: 'long' });
    } catch (e) {
      label = fmt(day, { weekday: 'long' });
    }
    text = el.dataset.shipsText.replace('[day]', label);
  }
  note.textContent = text;
  note.hidden = !text;
}

let timer = null;

const DeliveryEstimate = {
  init() {
    const els = document.querySelectorAll('[data-delivery-estimate]');
    els.forEach(render);
    if (timer) clearInterval(timer);
    // the countdown shows minutes → refresh once a minute
    if (els.length) timer = setInterval(() => document.querySelectorAll('[data-delivery-estimate]').forEach(render), 60000);
  },
};

export default DeliveryEstimate;
