'use strict';

const visits    = parseInt(localStorage.getItem('visitCount') || '0') + 1;
let timesData   = JSON.parse(localStorage.getItem('visitTimes') || '[]');
const enterTime = Date.now();

localStorage.setItem('visitCount', String(visits));
document.getElementById('visit-count').textContent = visits;

const avg = timesData.length
    ? Math.round(timesData.reduce((a, b) => a + b, 0) / timesData.length)
    : 0;
document.getElementById('avg-time').textContent = avg > 0 ? avg : 'нет данных';

window.addEventListener('beforeunload', () => {
    const spent = Math.round((Date.now() - enterTime) / 1000);
    timesData.push(spent);
    if (timesData.length > 20) timesData.shift();
    localStorage.setItem('visitTimes', JSON.stringify(timesData));
});


let calcExpr   = '';
const display  = document.getElementById('calc-display');

const updateDisplay = () => {
    display.textContent = calcExpr === '' ? '0' : calcExpr;
};

const ops = ['+', '-', '*', '/', '%'];

querySelectorAll('.calc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const val    = btn.dataset.value;
        const action = btn.dataset.action;

        switch (action) {
            case 'clear':
                calcExpr = '';
                break;

            case 'backspace':
                calcExpr = calcExpr.slice(0, -1);
                break;

            case 'negate':
                const num = parseFloat(calcExpr);
                if (!isNaN(num)) {
                    calcExpr = String(num * -1);
                }
                break;

            case 'equals':
                try {
                    const safe   = calcExpr.replace(/[^0-9+\-*/.%()]/g, '');
                    const result = Function('"use strict"; return (' + safe + ')')();
                    calcExpr     = String(parseFloat(result.toFixed(10)));
                } catch {
                    calcExpr = 'Ошибка';
                }
                break;

            default:
                
                // Если action не указан (или не специальное действие), работаем с val
                if (val === '.') {
                    const parts = calcExpr.split(/[+\-*/]/);
                    const last  = parts[parts.length - 1];
                    if (!last.includes('.')) {
                        calcExpr += '.';
                    }
                } 
                else if (ops.includes(val)) {
                    if (calcExpr === '' && val === '-') {
                        calcExpr = '-';
                    } else if (calcExpr !== '' && !ops.includes(calcExpr.slice(-1))) {
                        calcExpr += val;
                    }
                } 
                else {
                    if (calcExpr === '0') {
                        calcExpr = val;
                    } else {
                        calcExpr += val;
                    }
                }
                break;
        }

        updateDisplay();
    });
});

const rates = { USD: 1, EUR: 0.92, PLN: 4.02, RUB: 90.5, BYN: 3.27 };

document.getElementById('conv-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('conv-amount').value);
    const from   = document.getElementById('conv-from').value;
    const to     = document.getElementById('conv-to').value;
    const result = document.getElementById('converter-result');

    if (isNaN(amount) || amount < 0) {
        result.textContent = 'Введите корректную сумму';
        return;
    }

    const converted = (amount / rates[from]) * rates[to];
    result.textContent = amount + ' ' + from + ' = ' + converted.toFixed(2) + ' ' + to;
});