const STATES_COLOR = {
  NEW: "#656F7D",
  IN_PROGRESS: "#40A6E6",
  COMPLETED: "#F9BE33",
};

export class StateIconElement extends HTMLElement {
  constructor() {
    super();

    this.color = this.getAttribute("color") ?? STATES_COLOR.NEW;
  }
}
