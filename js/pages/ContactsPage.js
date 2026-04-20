import { BasePage } from './BasePage.js';
import { ContactsForm } from '../components/ContactsForm.js';

export class ContactsPage extends BasePage {
  cacheElements() {
    this.form = document.getElementById('contact-form');
  }

  render() {
    if (!this.form) return;
    this.contactsForm = new ContactsForm(this.form);
  }

  bindEvents() {
    this.contactsForm?.bindEvents();
  }
}

