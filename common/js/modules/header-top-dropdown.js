// Header top dropdowns (currency + language) — vanilla custom element.
//
// Markup (snippets/header-top-currency.liquid, snippets/header-top.liquid):
//   <header-top-dropdown>
//     <button data-dropdown-toggle aria-expanded="false">…</button>
//     <div data-dropdown-panel hidden> <a href="…">…</a> … </div>
//   </header-top-dropdown>
//
// Language options are plain links (`/<locale>/…`). Currency options are submit buttons of
// Shopify's localization form (country_code) — `?country=XX` links did not switch the market.
// Note: the `shopify theme dev` proxy answers 502 to that POST; test currency on the storefront.
// With one currency the selector is a plain label (no toggle / panel).

class HeaderTopDropdown extends HTMLElement {
  connectedCallback() {
    if (this.dataset.bound === '1') return;
    this.dataset.bound = '1';

    this.toggle = this.querySelector('[data-dropdown-toggle]');
    this.panel = this.querySelector('[data-dropdown-panel]');
    if (!this.toggle || !this.panel) return;

    this.toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.panel.hasAttribute('hidden')) this.open();
      else this.close();
    });

    // e.g. the dimmed backdrop under the header search panel
    this.addEventListener('click', (event) => {
      if (event.target.closest('[data-dropdown-close]')) this.close();
    });

    this.onDocumentClick = (event) => {
      if (!this.contains(event.target)) this.close();
    };
    document.addEventListener('click', this.onDocumentClick);

    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.panel.hasAttribute('hidden')) {
        this.close();
        this.toggle.focus();
      }
    });
  }

  disconnectedCallback() {
    if (this.onDocumentClick) document.removeEventListener('click', this.onDocumentClick);
    delete this.dataset.bound;
  }

  open() {
    // Only one header dropdown open at a time
    document.querySelectorAll('header-top-dropdown').forEach((el) => {
      if (el !== this && typeof el.close === 'function') el.close();
    });
    this.panel.removeAttribute('hidden');
    this.toggle.setAttribute('aria-expanded', 'true');
    const current = this.panel.querySelector('[data-dropdown-focus]') || this.panel.querySelector('[aria-current="true"]') || this.panel.querySelector('a');
    if (current) current.focus({ preventScroll: true });
  }

  close() {
    // a single-currency selector is a plain label: nothing to close (and open() closes every dropdown)
    if (!this.panel || !this.toggle) return;
    this.panel.setAttribute('hidden', '');
    this.toggle.setAttribute('aria-expanded', 'false');
  }
}

const HeaderTopDropdownModule = {
  init() {
    if (!customElements.get('header-top-dropdown')) {
      customElements.define('header-top-dropdown', HeaderTopDropdown);
    }
  },
};

export default HeaderTopDropdownModule;
