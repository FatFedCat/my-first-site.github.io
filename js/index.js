'use strict';

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return { icon: '🌅', title: 'Доброе утро!', };
    } else if (hour >= 12 && hour < 17) {
        return { icon: '☀️', title: 'Добрый день!', };
    } else if (hour >= 17 && hour < 22) {
        return { icon: '🌆', title: 'Добрый вечер!', };
    } else {
        return { icon: '🌙', title: 'Доброй ночи!', };
    }
};

const overlay = document.getElementById('greeting-modal-overlay');
const closeModal = () => overlay.classList.remove('open');

const greeting = getGreeting();
document.getElementById('greeting-modal-icon').textContent  = greeting.icon;
document.getElementById('greeting-modal-title').textContent = greeting.title;

overlay.classList.add('open');

document.getElementById('greeting-modal-btn').addEventListener('click', closeModal);

document.getElementById('greeting-modal-close').addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});