export class GreetingModal {
  constructor(overlay) {
    this.overlay = overlay;
    this.iconEl = overlay.querySelector('#greeting-modal-icon');
    this.titleEl = overlay.querySelector('#greeting-modal-title');
    this.btnEl = overlay.querySelector('#greeting-modal-btn');
    this.closeEl = overlay.querySelector('#greeting-modal-close');

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.close = this.close.bind(this);
  }

  getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return { icon: '🌅', title: 'Доброе утро!' };
    if (hour >= 12 && hour < 17) return { icon: '☀️', title: 'Добрый день!' };
    if (hour >= 17 && hour < 22) return { icon: '🌆', title: 'Добрый вечер!' };
    return { icon: '🌙', title: 'Доброй ночи!' };
  }

  onOverlayClick(e) {
    if (e.target === this.overlay) this.close();
  }

  onKeyDown(e) {
    if (e.key === 'Escape') this.close();
  }

  open() {
    const greeting = this.getGreeting();
    if (this.iconEl) this.iconEl.textContent = greeting.icon;
    if (this.titleEl) this.titleEl.textContent = greeting.title;

    this.overlay.classList.add('open');
    this.btnEl?.addEventListener('click', this.close);
    this.closeEl?.addEventListener('click', this.close);
    this.overlay.addEventListener('click', this.onOverlayClick);
    document.addEventListener('keydown', this.onKeyDown);
  }

  close() {
    this.overlay.classList.remove('open');
    this.btnEl?.removeEventListener('click', this.close);
    this.closeEl?.removeEventListener('click', this.close);
    this.overlay.removeEventListener('click', this.onOverlayClick);
    document.removeEventListener('keydown', this.onKeyDown);
  }
}

