import { BasePage } from './BasePage.js';
import { PROJECTS } from '../data/projects.js';
import { renderHTML, escapeHTML } from '../utils/render.js';
import {
  filterByTech,
  filterByYear,
  filterByStatus,
  getUniqueTechs,
  getUniqueYears,
  getUniqueStatuses,
  sortBy,
} from '../utils/helpers.js';

export class WorkPage extends BasePage {
  cacheElements() {
    this.tbody    = document.getElementById('proj-tbody');
    this.searchEl = document.getElementById('proj-search');
    this.techEl   = document.getElementById('proj-tech');
    this.yearEl   = document.getElementById('proj-year');
    this.statusEl = document.getElementById('proj-status');
    this.resetBtn = document.getElementById('proj-reset');
    this.metaEl   = document.getElementById('proj-meta');
    this.sortKey  = 'year';
    this.sortDir  = 'desc';
  }

  render() {
    if (!this.tbody) return;

    // Заполняем фильтры (functional: map)
    this._fillSelect(this.techEl,   getUniqueTechs(PROJECTS));
    this._fillSelect(this.yearEl,   getUniqueYears(PROJECTS));
    this._fillSelect(this.statusEl, getUniqueStatuses(PROJECTS));

    // Делаем заголовки кликабельными
    document.querySelectorAll('#proj-table .sortable').forEach((th) => {
      th.style.cursor = 'pointer';
    });

    this._updateTable();
  }

  bindEvents() {
    this.searchEl?.addEventListener('input', () => this._updateTable());
    this.techEl?.addEventListener('change', () => this._updateTable());
    this.yearEl?.addEventListener('change', () => this._updateTable());
    this.statusEl?.addEventListener('change', () => this._updateTable());

    this.resetBtn?.addEventListener('click', () => {
      [this.searchEl, this.techEl, this.yearEl, this.statusEl].forEach((el) => {
        if (el) el.value = '';
      });
      this.sortKey = 'year';
      this.sortDir = 'desc';
      this._updateTable();
    });

    document.querySelectorAll('#proj-table .sortable').forEach((th) => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        if (this.sortKey === key) {
          this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortKey = key;
          this.sortDir = 'asc';
        }
        this._updateTable();
      });
    });
  }

  _getFiltered() {
    const q      = (this.searchEl?.value || '').trim().toLowerCase();
    const tech   = this.techEl?.value   || '';
    const year   = this.yearEl?.value   || '';
    const status = this.statusEl?.value || '';

    // Цепочка через reduce: каждый фильтр применяется последовательно
    return [
      (list) => (q
        ? list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        : list),
      (list) => filterByTech(list, tech),
      (list) => filterByYear(list, year),
      (list) => filterByStatus(list, status),
    ].reduce((list, fn) => fn(list), PROJECTS);
  }

  _updateTable() {
    const filtered = this._getFiltered();
    const sorted   = sortBy(filtered, this.sortKey, this.sortDir);

    if (!this.tbody) return;

    if (sorted.length === 0) {
      renderHTML(this.tbody, '<tr><td colspan="6" style="text-align:center;padding:1.5rem">Ничего не найдено</td></tr>');
    } else {
      // Используем map для рендера строк
      const rows = sorted.map((p) => {
        const tags = p.tech.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join('');
        const link = p.link !== '#'
          ? `<a href="${p.link}" class="btn">Открыть</a>`
          : '—';
        return `
          <tr>
            <td>${escapeHTML(p.title)}</td>
            <td>${escapeHTML(p.description)}</td>
            <td><div class="tags">${tags}</div></td>
            <td>${p.year}</td>
            <td>${escapeHTML(p.status)}</td>
            <td>${link}</td>
          </tr>`;
      }).join('');
      renderHTML(this.tbody, rows);
    }

    // forEach для обновления индикаторов сортировки в заголовках
    document.querySelectorAll('#proj-table .sortable').forEach((th) => {
      const arrow = th.dataset.key === this.sortKey
        ? (this.sortDir === 'asc' ? ' ↑' : ' ↓')
        : ' ↕';
      th.textContent = th.textContent.replace(/ [↕↑↓]$/, '') + arrow;
    });

    if (this.metaEl) {
      this.metaEl.textContent = `Показано: ${sorted.length} из ${PROJECTS.length}`;
    }
  }

  _fillSelect(selectEl, values) {
    if (!selectEl) return;
    const options = values.map((v) => `<option value="${v}">${v}</option>`).join('');
    selectEl.insertAdjacentHTML('beforeend', options);
  }
}
