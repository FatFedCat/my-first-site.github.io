import { isValidEmail, isValidPhone, sanitizeFio, splitFio } from '../utils/validators.js';

export class ContactsForm {
  constructor(form) {
    this.form = form;

    this.fioInput = document.getElementById('fio');
    this.fioResult = document.getElementById('fio-result');

    this.phoneEl = document.getElementById('phone');
    this.emailEl = document.getElementById('email');
    this.msgEl = document.getElementById('message');

    this.dateInput = document.getElementById('contact-date');
    this.dateFeedback = document.getElementById('date-feedback');

    this.photoInput = document.getElementById('photo-upload');
    this.photoModalOverlay = document.getElementById('photo-modal-overlay');
    this.photoModalPreview = document.getElementById('photo-modal-preview');
    this.photoPreview = document.getElementById('photo-preview');

    this.closePhotoModal = this.closePhotoModal.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  setError(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'block' : 'none';
  }

  toggleErrorClass(el, hasError) {
    el?.classList.toggle('error', hasError);
  }

  bindEvents() {
    this.fioInput?.addEventListener('input', () => {
      this.fioInput.value = sanitizeFio(this.fioInput.value);
      const parts = splitFio(this.fioInput.value);

      if (parts.length >= 2 && parts[0] !== '') {
        document.getElementById('res-last').textContent = parts[0] || '—';
        document.getElementById('res-first').textContent = parts[1] || '—';
        document.getElementById('res-middle').textContent = parts[2] || '—';
        this.fioResult.style.display = 'flex';
      } else {
        this.fioResult.style.display = 'none';
      }
    });

    this.dateInput?.addEventListener('input', () => {
      const val = this.dateInput.value;

      if (!val) {
        this.dateFeedback.textContent = '';
        this.dateInput.classList.remove('error');
        return;
      }

      const chosen = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(chosen.getTime())) {
        this.dateFeedback.style.color = '#c0392b';
        this.dateFeedback.textContent = '⚠ Некорректная дата';
        this.dateInput.classList.add('error');
      } else if (chosen < today) {
        this.dateFeedback.style.color = '#c0392b';
        this.dateFeedback.textContent = '⚠ Дата не может быть раньше сегодняшней';
        this.dateInput.classList.add('error');
      } else {
        this.dateFeedback.style.color = '#1a7a4a';
        this.dateFeedback.textContent = '✓ Дата корректна';
        this.dateInput.classList.remove('error');
      }
    });

    this.photoInput?.addEventListener('change', () => {
      if (!this.photoInput.files || !this.photoInput.files[0]) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoModalPreview.src = e.target.result;
        this.photoModalOverlay.classList.add('open');
      };
      reader.readAsDataURL(this.photoInput.files[0]);
    });

    document.getElementById('photo-confirm-btn')?.addEventListener('click', () => {
      this.photoPreview.src = this.photoModalPreview.src;
      this.photoPreview.style.display = 'block';
      this.photoModalOverlay.classList.remove('open');
    });

    document.getElementById('photo-cancel-btn')?.addEventListener('click', this.closePhotoModal);
    this.photoModalOverlay?.addEventListener('click', (e) => {
      if (e.target === this.photoModalOverlay) this.closePhotoModal();
    });
    document.addEventListener('keydown', this.onKeyDown);

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      const fioVal = this.fioInput.value.trim();
      const fioOk = /^[А-Яа-яЁёA-Za-z\s\-]+$/.test(fioVal) && fioVal.length >= 2;
      this.setError('fio-error', !fioOk);
      this.toggleErrorClass(this.fioInput, !fioOk);
      ok = ok && fioOk;

      const phoneOk = isValidPhone(this.phoneEl.value);
      this.setError('phone-error', !phoneOk);
      this.toggleErrorClass(this.phoneEl, !phoneOk);
      ok = ok && phoneOk;

      const emailOk = isValidEmail(this.emailEl.value);
      this.setError('email-error', !emailOk);
      this.toggleErrorClass(this.emailEl, !emailOk);
      ok = ok && emailOk;

      const msgOk = this.msgEl.value.trim().length >= 3;
      this.setError('message-error', !msgOk);
      this.toggleErrorClass(this.msgEl, !msgOk);
      ok = ok && msgOk;

      if (!ok) return;

      alert(
        '✅ Форма успешно отправлена!\n\n'
        + `ФИО: ${fioVal}\n`
        + `Телефон: ${this.phoneEl.value}\n`
        + `Email: ${this.emailEl.value}`,
      );

      this.form.reset();
      this.photoPreview.style.display = 'none';
      this.photoPreview.src = '';
      this.fioResult.style.display = 'none';
      this.dateFeedback.textContent = '';
    });
  }

  onKeyDown(e) {
    if (e.key === 'Escape' && this.photoModalOverlay?.classList.contains('open')) {
      this.closePhotoModal();
    }
  }

  closePhotoModal() {
    this.photoModalOverlay?.classList.remove('open');
    if (this.photoModalPreview) this.photoModalPreview.src = '';
    if (this.photoInput) this.photoInput.value = '';
  }
}

