import { BasePage } from './BasePage.js';
import { HOBBIES } from '../data/hobbies.js';
import { Card } from '../components/Card.js';
import { renderHTML } from '../utils/render.js';

export class HobbiesPage extends BasePage {
  cacheElements() {
    this.cardsRoot = document.getElementById('hobby-cards');
    this.searchEl = document.getElementById('hobby-search');
    this.techEl = document.getElementById('hobby-tech');
    this.metaEl = document.getElementById('hobby-meta');
  }

  render() {
    if (!this.cardsRoot) return;

    // fill tech options (functional: reduce + map)
    const uniqueTech = HOBBIES.reduce((acc, h) => {
      (h.tech || []).forEach((t) => acc.add(t));
      return acc;
    }, new Set());

    if (this.techEl) {
      const options = Array.from(uniqueTech)
        .sort((a, b) => a.localeCompare(b, 'ru'))
        .map((t) => `<option value="${t}">${t}</option>`)
        .join('');
      this.techEl.insertAdjacentHTML('beforeend', options);
    }

    this.update();
  }

  bindEvents() {
    this.searchEl?.addEventListener('input', () => this.update());
    this.techEl?.addEventListener('change', () => this.update());
  }

  update() {
    const q = (this.searchEl?.value || '').trim().toLowerCase();
    const tech = this.techEl?.value || '';

    const filtered = HOBBIES
      .filter((h) => {
        const inTitle = h.title.toLowerCase().includes(q);
        const inDesc = h.description.toLowerCase().includes(q);
        const inBullets = (h.bullets || []).some((b) => b.toLowerCase().includes(q));
        return q === '' ? true : inTitle || inDesc || inBullets;
      })
      .filter((h) => (tech ? (h.tech || []).includes(tech) : true));

    const html = filtered.map((h) => new Card(h).toHTML()).join('');
    renderHTML(this.cardsRoot, html || '<p class="lead">Ничего не найдено.</p>');

    if (this.metaEl) {
      const allCount = HOBBIES.length;
      const count = filtered.length;
      const techCount = filtered.reduce((acc, h) => acc + (h.tech?.length || 0), 0);
      this.metaEl.textContent = `Показано: ${count} из ${allCount}. Тегов у найденных: ${techCount}.`;
    }
  }
}


