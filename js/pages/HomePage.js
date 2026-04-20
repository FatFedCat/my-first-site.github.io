import { BasePage } from './BasePage.js';
import { GreetingModal } from '../components/GreetingModal.js';

export class HomePage extends BasePage {
  cacheElements() {
    this.overlay = document.getElementById('greeting-modal-overlay');
  }

  render() {
    if (!this.overlay) return;
    new GreetingModal(this.overlay).open();
  }
}

