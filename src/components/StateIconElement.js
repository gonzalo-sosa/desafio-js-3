import { STATES_COLOR } from '../consts';

export class StateIconElement extends HTMLElement {
  static get observedAttributes() {
    return ['color'];
  }

  constructor() {
    super();

    this.color = this.getAttribute('color') ?? STATES_COLOR.NEW;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<span style="vertical-align: middle; display: inline-block; width: 1rem; height: 1rem; border-radius: 100%; background-color: ${this.color};"></span>`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'color' && oldValue !== newValue) {
      this.updateColor(newValue);
    }
  }

  updateColor(color) {
    this.color = color;
  }
}

customElements.define('state-icon-element', StateIconElement);
