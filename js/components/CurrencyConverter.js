import { CURRENCY_RATES } from '../data/currencyRates.js';

export class CurrencyConverter {
  constructor({ amountEl, fromEl, toEl, buttonEl, resultEl, rates = CURRENCY_RATES }) {
    this.amountEl = amountEl;
    this.fromEl = fromEl;
    this.toEl = toEl;
    this.buttonEl = buttonEl;
    this.resultEl = resultEl;
    this.rates = rates;
  }

  convert(amount, from, to) {
    return (amount / this.rates[from]) * this.rates[to];
  }

  init() {
    this.buttonEl?.addEventListener('click', () => {
      const amount = parseFloat(this.amountEl.value);
      const from = this.fromEl.value;
      const to = this.toEl.value;

      if (!this.resultEl) return;

      if (Number.isNaN(amount) || amount < 0) {
        this.resultEl.textContent = 'Введите корректную сумму';
        return;
      }

      const converted = this.convert(amount, from, to);
      this.resultEl.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    });
  }
}

