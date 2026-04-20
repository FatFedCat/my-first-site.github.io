import { escapeHTML } from '../utils/render.js';

export class Card {
  constructor(data) {
    this.data = data;
  }

  toHTML() {
    const { emoji, title, description, bullets = [], tech = [] } = this.data;
    const tags = tech
      .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
      .join('');
    const items = bullets
      .map((b) => `<li>${escapeHTML(b)}</li>`)
      .join('');

    return `
      <article class="card">
        <h2>${escapeHTML(emoji)} ${escapeHTML(title)}</h2>
        <p>${escapeHTML(description)}</p>
        ${tags ? `<div class="tags">${tags}</div>` : ''}
        ${items ? `<ul>${items}</ul>` : ''}
      </article>
    `;
  }
}

