export class PopoverElement extends HTMLElement {
  constructor() {
    super();
    this.open = this.getAttribute("open") ?? false;

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
      <div class="popover" open="${this.open}"><slot/></div>
    `;

    this.div = this.shadowRoot.querySelector("div");
  }

  togglePopover() {
    this.open = !this.open;
    this.setAttribute("open", this.open);
    this.div.classList.toggle("popover--open");
  }

  //connectedCallback() {}
}

customElements.define("popover-element", PopoverElement);
