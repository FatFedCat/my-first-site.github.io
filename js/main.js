import { HomePage } from './pages/HomePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { HobbiesPage } from './pages/HobbiesPage.js';
import { ContactsPage } from './pages/ContactsPage.js';
import { SkillsPage } from './pages/SkillsPage.js';
import { ToolsPage } from './pages/ToolsPage.js';

const PAGES = {
  home: HomePage,
  about: AboutPage,
  hobbies: HobbiesPage,
  contacts: ContactsPage,
  skills: SkillsPage,
  tools: ToolsPage,
};

function getPageKey() {
  return document.body?.dataset?.page || '';
}

function init() {
  const pageKey = getPageKey();

  const PageClass = PAGES[pageKey];
  if (!PageClass) return;

  const page = new PageClass();
  page.init();
}

document.addEventListener('DOMContentLoaded', init);
