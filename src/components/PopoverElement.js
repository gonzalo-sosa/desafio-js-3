// TODO: quitar popover al realizar click fuera de la lista

export class PopoverElement extends HTMLElement {
  constructor() {
    super();
    this.open = this.getAttribute("open") === "true";

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .popover{
          display: none;
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          display: none;
          z-index: 1000;
        }
        .popover--open{
          display: block;   
        }
      </style>
      <div class="popover"><slot/></div>
    `;

    this.div = this.shadowRoot.querySelector("div");
  }

  togglePopover() {
    this.open = !this.open;
    this.setAttribute("open", this.open);
    this.div.classList.toggle("popover--open");
  }

  disconnectedCallback() {
    this.togglePopover();
  }
}

customElements.define("popover-element", PopoverElement);
