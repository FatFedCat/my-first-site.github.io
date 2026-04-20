export class Calculator {
    constructor({ displayEl, buttons }) {
      this.displayEl = displayEl;
      this.buttons = buttons;
      this.expr = '';
      this.ops = ['+', '-', '*', '/', '%'];
    }
  
    updateDisplay() {
      if (!this.displayEl) return;
      this.displayEl.textContent = this.expr === '' ? '0' : this.expr;
    }
  
    safeEval(expr) {
      const safe = expr.replace(/[^0-9+\-*/.%()]/g, '');
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + safe + ')')();
      return String(parseFloat(Number(result).toFixed(10)));
    }
  
    onButton(btn) {
      const val = btn.dataset.value;
      const action = btn.dataset.action;
  
      switch (action) {
        case 'clear':
          this.expr = '';
          break;
        case 'backspace':
          this.expr = this.expr.slice(0, -1);
          break;
        case 'negate': {
          const num = parseFloat(this.expr);
          if (!Number.isNaN(num)) this.expr = String(num * -1);
          break;
        }
        case 'equals':
          try {
            this.expr = this.safeEval(this.expr);
          } catch {
            this.expr = 'Ошибка';
          }
          break;
        default:
          if (!val) break;
  
          if (val === '.') {
            const parts = this.expr.split(/[+\-*/%]/);
            const last = parts[parts.length - 1];
            if (!last.includes('.') && (/\d$/.test(this.expr) || this.expr === '')) {
              this.expr = this.expr === '' ? '0.' : this.expr + '.';
            }
          } else if (this.ops.includes(val)) {
            if (this.expr === '' && val === '-') {
              this.expr = '-';
            } else if (
              this.expr !== ''
              && !this.ops.includes(this.expr.slice(-1))
              && this.expr.slice(-1) !== '.'
            ) {
              this.expr += val;
            }
          } else {
            this.expr = this.expr === '0' ? val : this.expr + val;
          }
          break;
      }
  
      this.updateDisplay();
    }
  
    init() {
      this.updateDisplay();
      this.buttons.forEach((btn) => {
        btn.addEventListener('click', () => this.onButton(btn));
      });
    }
  }