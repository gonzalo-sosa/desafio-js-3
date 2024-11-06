export class TabButton extends HTMLElement {
  constructor() {
    super();

    this.tabName = this.getAttribute("tab-name");
    this.render();
  }

  render() {
    this.innerHTML = `
      <button value="${
        this.tabName
      }" class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
        ${this.capitalize(this.tabName)}
      </button>
    `;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

customElements.define("tab-button", TabButton);
