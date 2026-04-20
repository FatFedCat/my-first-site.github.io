export class VisitStats {
  constructor({ countEl, avgEl, storageKey = 'toolsPageVisitStats' }) {
    this.countEl = countEl;
    this.avgEl = avgEl;
    this.storageKey = storageKey;
    this.enterTime = Date.now();
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '{"visits":0,"times":[]}');
    } catch {
      return { visits: 0, times: [] };
    }
  }

  save(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  init() {
    const data = this.load();
    data.visits += 1;
    this.save(data);

    if (this.countEl) this.countEl.textContent = String(data.visits);

    const avg = data.times.length
      ? Math.round(data.times.reduce((a, b) => a + b, 0) / data.times.length)
      : 0;
    if (this.avgEl) this.avgEl.textContent = avg > 0 ? String(avg) : 'нет данных';

    window.addEventListener('beforeunload', () => {
      const spent = Math.round((Date.now() - this.enterTime) / 1000);
      const next = this.load();
      next.times.push(spent);
      if (next.times.length > 20) next.times.shift();
      this.save(next);
    });
  }
}

