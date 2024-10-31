export class PopoverElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.popover = document.createElement("div");
    this.popover.classList.add("popover");
    this.popover.innerText = "Contenido por defecto";
    this.popover.style.display = "none";

    const style = document.createElement("style");

    style.textContent = `
      .popover {
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          padding: 10px;
          display: none;
          z-index: 1000;
      }
    `;

    this.shadowRoot.append(style, this.popover);

    this.addEventListener("click", () => this.togglePopover());
  }

  togglePopover() {
    const isVisible = this.popover.style.display === "block";
    this.popover.style.display = isVisible ? "none" : "block";
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.popover);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "text") {
      this.popover.innerText = newValue;
    }
  }

  static get observedAttributes() {
    return ["text"];
  }
}

customElements.define("popover-element", PopoverElement);
