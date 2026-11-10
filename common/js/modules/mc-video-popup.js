// Merci video popup — sections/mc-video-banner.liquid
// [data-mc-video-open][data-video-src="https://www.youtube.com/embed/ID?autoplay=1"] opens the
// shared <dialog id="McVideoDialog"> and injects the iframe; closing removes it (stops playback).
// Idempotent: one delegated listener on document.

const McVideoPopup = {
  init() {
    if (document.documentElement.dataset.mcVideoBound === '1') return;
    document.documentElement.dataset.mcVideoBound = '1';

    document.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-mc-video-open]');
      if (opener) {
        event.preventDefault();
        McVideoPopup.open(opener.dataset.videoSrc, opener.dataset.videoTitle || '', opener.dataset.closeLabel);
        return;
      }
      const dialog = event.target.closest('#McVideoDialog');
      if (dialog && (event.target === dialog || event.target.closest('[data-mc-video-close]'))) {
        McVideoPopup.close();
      }
    });
  },

  dialog() {
    let dialog = document.getElementById('McVideoDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'McVideoDialog';
    dialog.className = 'mc-video-dialog';
    dialog.innerHTML =
      '<button type="button" class="mc-video-dialog__close" data-mc-video-close aria-label="Close">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button>' +
      '<div class="mc-video-dialog__frame"></div>';
    dialog.addEventListener('close', () => {
      const frame = dialog.querySelector('.mc-video-dialog__frame');
      if (frame) frame.innerHTML = '';
    });
    document.body.appendChild(dialog);
    return dialog;
  },

  open(src, title, closeLabel) {
    if (!src) return;
    const dialog = McVideoPopup.dialog();
    if (closeLabel) dialog.querySelector('[data-mc-video-close]').setAttribute('aria-label', closeLabel);
    const frame = dialog.querySelector('.mc-video-dialog__frame');
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    frame.innerHTML = '';
    frame.appendChild(iframe);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  },

  close() {
    const dialog = document.getElementById('McVideoDialog');
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  },
};

export default McVideoPopup;
