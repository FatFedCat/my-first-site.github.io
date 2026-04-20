export class BasePage {
  init() {
    this.cacheElements();
    this.render();
    this.bindEvents();
  }

  // eslint-disable-next-line class-methods-use-this
  cacheElements() {}

  // eslint-disable-next-line class-methods-use-this
  render() {}

  // eslint-disable-next-line class-methods-use-this
  bindEvents() {}
}

