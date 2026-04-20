import { fetchJSON } from '../utils/api.js';
import { escapeHTML, renderHTML } from '../utils/render.js';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function compareAsc(a, b) {
  return a.localeCompare(b, 'ru', { sensitivity: 'base' });
}

export class UsersTable {
  constructor({ root, filterEl, sortEl, reloadEl }) {
    this.root = root;
    this.filterEl = filterEl;
    this.sortEl = sortEl;
    this.reloadEl = reloadEl;
    this.data = [];
  }

  async load() {
    // Promise/async fetch
    const raw = await fetchJSON(API_URL);

    // functional map: normalize shape
    this.data = raw.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      city: u.address?.city || '',
      company: u.company?.name || '',
    }));
  }

  getFilteredSorted() {
    const q = (this.filterEl?.value || '').trim().toLowerCase();
    const sortValue = this.sortEl?.value || 'name:asc';
    const [field, dir] = sortValue.split(':');

    const filtered = this.data.filter((row) => {
      if (q === '') return true;
      return (
        row.name.toLowerCase().includes(q)
        || row.email.toLowerCase().includes(q)
        || row.city.toLowerCase().includes(q)
        || row.company.toLowerCase().includes(q)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const left = String(a[field] || '');
      const right = String(b[field] || '');
      const cmp = compareAsc(left, right);
      return dir === 'desc' ? -cmp : cmp;
    });

    return { filtered: sorted, total: this.data.length };
  }

  toHTML(rows, { total }) {
    const body = rows
      .map(
        (r) => `
          <tr>
            <td>${escapeHTML(r.name)}</td>
            <td>${escapeHTML(r.email)}</td>
            <td>${escapeHTML(r.city)}</td>
            <td>${escapeHTML(r.company)}</td>
          </tr>
        `,
      )
      .join('');

    return `
      <p class="table-meta">Показано: <strong>${rows.length}</strong> из <strong>${total}</strong></p>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Город</th>
              <th>Компания</th>
            </tr>
          </thead>
          <tbody>
            ${body || '<tr><td colspan="4">Ничего не найдено</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  render() {
    if (!this.root) return;
    const { filtered, total } = this.getFilteredSorted();
    renderHTML(this.root, this.toHTML(filtered, { total }));
  }

  async init() {
    if (!this.root) return;

    renderHTML(this.root, '<p class="lead">Загрузка...</p>');
    await this.load();
    this.render();

    this.filterEl?.addEventListener('input', () => this.render());
    this.sortEl?.addEventListener('change', () => this.render());
    this.reloadEl?.addEventListener('click', async () => {
      renderHTML(this.root, '<p class="lead">Обновление...</p>');
      await this.load();
      this.render();
    });
  }
}

