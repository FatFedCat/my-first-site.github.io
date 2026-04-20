import { BasePage } from './BasePage.js';
import { VisitStats } from '../components/VisitStats.js';
import { Calculator } from '../components/Calculator.js';
import { CurrencyConverter } from '../components/CurrencyConverter.js';
import { UsersTable } from '../components/UsersTable.js';

export class ToolsPage extends BasePage {
  cacheElements() {
    this.visitCountEl = document.getElementById('visit-count');
    this.avgTimeEl = document.getElementById('avg-time');

    this.calcDisplayEl = document.getElementById('calc-display');
    this.calcButtons = Array.from(document.querySelectorAll('.calc-btn'));

    this.amountEl = document.getElementById('conv-amount');
    this.fromEl = document.getElementById('conv-from');
    this.toEl = document.getElementById('conv-to');
    this.convBtn = document.getElementById('conv-btn');
    this.convResult = document.getElementById('converter-result');

    this.usersRoot = document.getElementById('users-table');
    this.usersFilter = document.getElementById('users-filter');
    this.usersSort = document.getElementById('users-sort');
    this.usersReload = document.getElementById('users-reload');
  }

  render() {
    new VisitStats({ countEl: this.visitCountEl, avgEl: this.avgTimeEl }).init();

    if (this.calcDisplayEl && this.calcButtons.length) {
      new Calculator({ displayEl: this.calcDisplayEl, buttons: this.calcButtons }).init();
    }

    if (this.amountEl && this.fromEl && this.toEl && this.convBtn && this.convResult) {
      new CurrencyConverter({
        amountEl: this.amountEl,
        fromEl: this.fromEl,
        toEl: this.toEl,
        buttonEl: this.convBtn,
        resultEl: this.convResult,
      }).init();
    }

    if (this.usersRoot) {
      new UsersTable({
        root: this.usersRoot,
        filterEl: this.usersFilter,
        sortEl: this.usersSort,
        reloadEl: this.usersReload,
      }).init();
    }
  }
}

