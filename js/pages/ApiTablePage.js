import { BasePage } from './BasePage.js';
import { renderHTML, escapeHTML } from '../utils/render.js';
import { fetchJSON } from '../utils/api.js';
import { formatDate } from '../utils/date.js';
import { sortBy } from '../utils/helpers.js';

export class ApiTablePage extends BasePage {
  cacheElements() {
    this.userInput  = document.getElementById('gh-user');
    this.loadBtn    = document.getElementById('gh-load');
    this.statusEl   = document.getElementById('gh-status');
    this.filtersEl  = document.getElementById('gh-filters');
    this.searchEl   = document.getElementById('gh-search');
    this.langEl     = document.getElementById('gh-lang');
    this.metaEl     = document.getElementById('gh-meta');
    this.wrapEl     = document.getElementById('gh-wrap');
    this.tbody      = document.getElementById('gh-tbody');

    this.repos   = [];
    this.sortKey = 'updated_at';
    this.sortDir = 'desc';
  }

  render() {
    // Делаем заголовки кликабельными
    document.querySelectorAll('[data-key]').forEach((th) => {
      th.style.cursor = 'pointer';
    });
  }

  bindEvents() {
    this.loadBtn?.addEventListener('click', () => this._load());

    this.userInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._load();
    });

    this.searchEl?.addEventListener('input', () => this._renderTable());
    this.langEl?.addEventListener('change', () => this._renderTable());

    document.querySelectorAll('[data-key]').forEach((th) => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        if (this.sortKey === key) {
          this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortKey = key;
          this.sortDir = 'asc';
        }
        this._renderTable();
      });
    });
  }

  async _load() {
    const username = this.userInput?.value.trim();
    if (!username) return;

    renderHTML(this.statusEl, '<p class="lead">⏳ Загрузка...</p>');
    if (this.filtersEl) this.filtersEl.style.display = 'none';
    if (this.wrapEl)    this.wrapEl.style.display    = 'none';

    try {
      const data = await fetchJSON(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
      );
      this.repos = data;
      renderHTML(this.statusEl, '');
      this._fillLangFilter();
      if (this.searchEl) this.searchEl.value = '';
      if (this.langEl)   this.langEl.value   = '';
      if (this.filtersEl) this.filtersEl.style.display = '';
      if (this.wrapEl)    this.wrapEl.style.display    = '';
      this._renderTable();
    } catch (err) {
      renderHTML(
        this.statusEl,
        `<p class="lead" style="color:#c0392b">❌ Ошибка: ${escapeHTML(err.message)}</p>`
      );
    }
  }

  _getFiltered() {
    const q    = (this.searchEl?.value || '').trim().toLowerCase();
    const lang = this.langEl?.value || '';

    // Цепочка фильтров через reduce
    return [
      (list) => (q    ? list.filter((r) => r.name.toLowerCase().includes(q)) : list),
      (list) => (lang ? list.filter((r) => r.language === lang)               : list),
    ].reduce((list, fn) => fn(list), this.repos);
  }

  _fillLangFilter() {
    if (!this.langEl) return;

    // Уникальные языки через reduce
    const langs = this.repos.reduce((acc, r) => {
      if (r.language) acc.add(r.language);
      return acc;
    }, new Set());

    // Оставляем только первый option «Все языки», добавляем остальные через map
    this.langEl.querySelectorAll('option:not(:first-child)').forEach((o) => o.remove());
    const options = Array.from(langs).sort()
      .map((l) => `<option value="${l}">${l}</option>`)
      .join('');
    this.langEl.insertAdjacentHTML('beforeend', options);
  }

  _renderTable() {
    const filtered = this._getFiltered();
    const sorted   = sortBy(filtered, this.sortKey, this.sortDir);

    if (this.metaEl) {
      this.metaEl.textContent = `Показано: ${sorted.length} из ${this.repos.length}`;
    }

    if (!this.tbody) return;

    if (sorted.length === 0) {
      renderHTML(this.tbody, '<tr><td colspan="5" style="text-align:center;padding:1.5rem">Ничего не найдено</td></tr>');
      return;
    }

    // map для построения строк таблицы
    const rows = sorted.map((r) => `
      <tr>
        <td><a href="${r.html_url}" target="_blank" rel="noopener">${escapeHTML(r.name)}</a></td>
        <td>${r.description ? escapeHTML(r.description) : '—'}</td>
        <td>${r.language ? `<span class="tag">${escapeHTML(r.language)}</span>` : '—'}</td>
        <td>⭐ ${r.stargazers_count}</td>
        <td>${formatDate(r.updated_at)}</td>
      </tr>`).join('');

    renderHTML(this.tbody, rows);

    // forEach для обновления стрелок сортировки
    document.querySelectorAll('[data-key]').forEach((th) => {
      const arrow = th.dataset.key === this.sortKey
        ? (this.sortDir === 'asc' ? ' ↑' : ' ↓')
        : ' ↕';
      th.textContent = th.textContent.replace(/ [↕↑↓]$/, '') + arrow;
    });
  }
}
