'use strict';

const setError = (id, show) => {
    document.getElementById(id).style.display = show ? 'block' : 'none';
};

const toggleErrorClass = (el, hasError) => {
    el.classList.toggle('error', hasError);
};

const isValidPhone = (val) =>
    /^[\+]?[0-9\s\-().]{7,20}$/.test(val.trim());

const isValidEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

/* ── ФИО ── */
const fioInput  = document.getElementById('fio');
const fioResult = document.getElementById('fio-result');

fioInput.addEventListener('input', () => {
    fioInput.value = fioInput.value.replace(/[^А-Яа-яЁёA-Za-z\s\-]/g, '');

    const parts = fioInput.value.trim().split(/\s+/);

    if (parts.length >= 2 && parts[0] !== '') {
        document.getElementById('res-last').textContent   = parts[0] || '—';
        document.getElementById('res-first').textContent  = parts[1] || '—';
        document.getElementById('res-middle').textContent = parts[2] || '—';
        fioResult.style.display = 'flex';
    } else {
        fioResult.style.display = 'none';
    }
});

/* ── Дата ── */
const dateInput    = document.getElementById('contact-date');
const dateFeedback = document.getElementById('date-feedback');

dateInput.addEventListener('input', () => {
    const val = dateInput.value;

    if (!val) {
        dateFeedback.textContent = '';
        dateInput.classList.remove('error');
        return;
    }

    const chosen = new Date(val);
    const today  = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(chosen.getTime())) {
        dateFeedback.style.color = '#c0392b';
        dateFeedback.textContent = '⚠ Некорректная дата';
        dateInput.classList.add('error');
    } else if (chosen < today) {
        dateFeedback.style.color = '#c0392b';
        dateFeedback.textContent = '⚠ Дата не может быть раньше сегодняшней';
        dateInput.classList.add('error');
    } else {
        dateFeedback.style.color = '#1a7a4a';
        dateFeedback.textContent = '✓ Дата корректна';
        dateInput.classList.remove('error');
    }
});

/* ── Фото: сначала модальное окно подтверждения ── */
const photoInput        = document.getElementById('photo-upload');
const photoModalOverlay = document.getElementById('photo-modal-overlay');
const photoModalPreview = document.getElementById('photo-modal-preview');
const photoPreview      = document.getElementById('photo-preview');
let pendingPhotoFile    = null;

const closePhotoModal = () => {
    photoModalOverlay.classList.remove('open');
    photoModalPreview.src = '';
    pendingPhotoFile      = null;
    photoInput.value      = '';
};

photoInput.addEventListener('change', function () {
    if (!this.files || !this.files[0]) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        pendingPhotoFile      = this.files[0];
        photoModalPreview.src = e.target.result;
        photoModalOverlay.classList.add('open');
    };

    reader.readAsDataURL(this.files[0]);
});

document.getElementById('photo-confirm-btn').addEventListener('click', () => {
    photoPreview.src           = photoModalPreview.src;
    photoPreview.style.display = 'block';
    photoModalOverlay.classList.remove('open');
    pendingPhotoFile = null;
});

document.getElementById('photo-cancel-btn').addEventListener('click', closePhotoModal);

photoModalOverlay.addEventListener('click', (e) => {
    if (e.target === photoModalOverlay) closePhotoModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoModalOverlay.classList.contains('open')) {
        closePhotoModal();
    }
});

/* ── Submit ── */
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const fioVal = fioInput.value.trim();
    const fioOk  = /^[А-Яа-яЁёA-Za-z\s\-]+$/.test(fioVal) && fioVal.length >= 2;
    setError('fio-error', !fioOk);
    toggleErrorClass(fioInput, !fioOk);
    if (!fioOk) isValid = false;

    const phoneEl = document.getElementById('phone');
    const phoneOk = isValidPhone(phoneEl.value);
    setError('phone-error', !phoneOk);
    toggleErrorClass(phoneEl, !phoneOk);
    if (!phoneOk) isValid = false;

    const emailEl = document.getElementById('email');
    const emailOk = isValidEmail(emailEl.value);
    setError('email-error', !emailOk);
    toggleErrorClass(emailEl, !emailOk);
    if (!emailOk) isValid = false;

    const msgEl = document.getElementById('message');
    const msgOk = msgEl.value.trim().length >= 3;
    setError('message-error', !msgOk);
    toggleErrorClass(msgEl, !msgOk);
    if (!msgOk) isValid = false;

    if (isValid) {
        alert(
            '✅ Форма успешно отправлена!\n\n' +
            'ФИО: '     + fioVal        + '\n' +
            'Телефон: ' + phoneEl.value + '\n' +
            'Email: '   + emailEl.value
        );
        e.target.reset();
        photoPreview.style.display = 'none';
        photoPreview.src           = '';
        fioResult.style.display    = 'none';
        dateFeedback.textContent   = '';
    }
});