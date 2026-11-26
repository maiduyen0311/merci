class PredictiveSearch extends SearchForm {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.allPredictiveSearchInstances = document.querySelectorAll('predictive-search');
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = '';

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));
    // a click on a result / suggestion = the term was useful → remember it (recent searches)
    this.predictiveSearchResults.addEventListener('click', (event) => {
      if (event.target.closest('[data-search-recent-clear]')) {
        event.preventDefault();
        PredictiveSearch.clearRecent();
        this.fillRecent();
        this.input.focus();
        return;
      }
      const link = event.target.closest('a');
      if (!link) return;
      PredictiveSearch.saveRecent(link.dataset.searchTerm || this.getQuery());
    });

    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    super.onChange();
    const newSearchTerm = this.getQuery();
    if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
      // Remove the results when they are no longer relevant for the new search term
      // so they don't show up when the dropdown opens again
      this.querySelector('#predictive-search-results-groups-wrapper')?.remove();
    }

    // Update the term asap, don't wait for the predictive search query to finish loading
    this.updateSearchForTerm(this.searchTerm, newSearchTerm);

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      this.close(true);
      this.showDiscovery();
      return;
    }

    this.getSearchResults(this.searchTerm);
  }

  onFormSubmit(event) {
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
    else PredictiveSearch.saveRecent(this.getQuery());
  }

  onFormReset(event) {
    super.onFormReset(event);
    if (super.shouldResetForm()) {
      this.searchTerm = '';
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }

  onFocus() {
    const currentSearchTerm = this.getQuery();

    if (!currentSearchTerm.length) {
      this.showDiscovery();
      return;
    }

    if (this.searchTerm !== currentSearchTerm) {
      // Search term was changed from other search input, treat it as a user change
      this.onChange();
    } else if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onKeyup(event) {
    if (event.code === 'Escape') return; // handled on keydown
    // empty box: keep the suggestions open (arrow keys move through them), otherwise close
    if (!this.getQuery().length && !this.hasAttribute('discovery')) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
    }
  }

  onKeydown(event) {
    // Escape closes the dropdown (on keydown: the header search panel may hide the box before keyup)
    if (event.code === 'Escape' && this.isOpen) this.close();
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault();
    }
  }

  updateSearchForTerm(previousTerm, newTerm) {
    const searchForTextElement = this.querySelector('[data-predictive-search-search-for-text]');
    const currentButtonText = searchForTextElement?.innerText;
    if (currentButtonText) {
      if (currentButtonText.match(new RegExp(previousTerm, 'g')).length > 1) {
        // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
        return;
      }
      const newButtonText = currentButtonText.replace(previousTerm, newTerm);
      searchForTextElement.innerText = newButtonText;
    }
  }

  switchOption(direction) {
    if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');

    // Filter out hidden elements (duplicated page and article resources) thanks
    // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    const allVisibleElements = Array.from(this.querySelectorAll('li, button.predictive-search__item')).filter(
      (element) => element.offsetParent !== null
    );
    let activeElementIndex = 0;

    if (moveUp && !selectedElement) return;

    let selectedElementIndex = -1;
    let i = 0;

    while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
      if (allVisibleElements[i] === selectedElement) {
        selectedElementIndex = i;
      }
      i++;
    }

    this.statusElement.textContent = '';

    if (!moveUp && selectedElement) {
      activeElementIndex = selectedElementIndex === allVisibleElements.length - 1 ? 0 : selectedElementIndex + 1;
    } else if (moveUp) {
      activeElementIndex = selectedElementIndex === 0 ? allVisibleElements.length - 1 : selectedElementIndex - 1;
    }

    if (activeElementIndex === selectedElementIndex) return;

    const activeElement = allVisibleElements[activeElementIndex];

    activeElement.setAttribute('aria-selected', true);
    if (selectedElement) selectedElement.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', activeElement.id);
  }

  selectOption() {
    const selectedOption = this.querySelector('[aria-selected="true"] a, button[aria-selected="true"]');

    if (selectedOption) selectedOption.click();
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    this.setLiveRegionLoadingState();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

    fetch(`${routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`, {
      signal: this.abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('#shopify-section-predictive-search').innerHTML;
        // Save bandwidth keeping the cache in all instances synced
        this.allPredictiveSearchInstances.forEach((predictiveSearchInstance) => {
          predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
        });
        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        if (error?.code === 20) {
          // Code 20 means the call was aborted
          return;
        }
        this.close();
        throw error;
      });
  }

  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

    this.setLiveRegionText(this.loadingText);
    this.setAttribute('loading', true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  // --- Search suggestions (Nhóm 3 #9): recent searches, popular terms, popular products -----------
  // Shown while the box is focused and empty. Markup = sections/search-discovery.liquid, fetched once
  // per page (data-discovery-url is only set when Theme settings → Search behavior enables it).
  static RECENT_KEY = 'mc_recent_searches';

  static readRecent() {
    try {
      const list = JSON.parse(localStorage.getItem(PredictiveSearch.RECENT_KEY) || '[]');
      return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : [];
    } catch (e) {
      return [];
    }
  }

  static saveRecent(term) {
    const t = String(term || '').trim().slice(0, 60);
    if (!t) return;
    const list = PredictiveSearch.readRecent().filter((x) => x.toLowerCase() !== t.toLowerCase());
    list.unshift(t);
    try {
      localStorage.setItem(PredictiveSearch.RECENT_KEY, JSON.stringify(list.slice(0, 6)));
    } catch (e) {
      /* private mode */
    }
  }

  static clearRecent() {
    try {
      localStorage.removeItem(PredictiveSearch.RECENT_KEY);
    } catch (e) {
      /* private mode */
    }
  }

  fillRecent() {
    const group = this.predictiveSearchResults.querySelector('[data-search-recent]');
    const list = group && group.querySelector('[data-search-recent-list]');
    if (!list) return;
    const recent = PredictiveSearch.readRecent();
    list.replaceChildren(
      ...recent.map((term, i) => {
        const li = document.createElement('li');
        li.id = `SearchRecent-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        const a = document.createElement('a');
        a.className = 'search-discovery__chip';
        a.tabIndex = -1;
        a.href = list.dataset.searchBase + encodeURIComponent(term);
        a.dataset.searchTerm = term;
        a.textContent = term;
        li.append(a);
        return li;
      })
    );
    group.hidden = recent.length === 0;
  }

  showDiscovery() {
    const url = this.dataset.discoveryUrl;
    if (!url) return;
    if (!PredictiveSearch.discovery) {
      PredictiveSearch.discovery = fetch(url)
        .then((r) => (r.ok ? r.text() : ''))
        .then((text) => {
          const el = new DOMParser().parseFromString(text, 'text/html').querySelector('[data-search-discovery]');
          return el ? el.outerHTML : '';
        })
        .catch(() => '');
    }
    PredictiveSearch.discovery.then((html) => {
      // typed something meanwhile, or left the box → not wanted any more
      if (!html || this.getQuery().length || !this.contains(document.activeElement)) return;
      this.predictiveSearchResults.innerHTML = html;
      this.fillRecent();
      this.setAttribute('discovery', '');
      this.open();
    });
  }

  renderSearchResults(resultsMarkup) {
    this.removeAttribute('discovery');
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', true);

    this.setLiveRegionResults();
    this.open();
  }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
  }

  getResultsMaxHeight() {
    this.resultsMaxHeight =
      window.innerHeight - document.querySelector('.section-header').getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }

  open() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;
  }

  close(clearSearchTerm = false) {
    this.closeResults(clearSearchTerm);
    this.isOpen = false;
  }

  closeResults(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = '';
      this.removeAttribute('results');
    }
    const selected = this.querySelector('[aria-selected="true"]');

    if (selected) selected.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', '');
    this.removeAttribute('loading');
    this.removeAttribute('open');
    this.removeAttribute('discovery');
    this.input.setAttribute('aria-expanded', false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute('style');
  }
}

customElements.define('predictive-search', PredictiveSearch);
