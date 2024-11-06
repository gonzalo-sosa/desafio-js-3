import { TabButton } from "./TabButton.js";
import { TabContent } from "./TabContent.js";

export const TABS_DEFAULT = ["details", "map", "canvas"];

export class TabManager extends HTMLElement {
  constructor(tabs) {
    super();
    this.tabs = tabs ?? TABS_DEFAULT;
    this.currentTab = this.getAttribute("currentTab") ?? this.tabs[0];
    this.setAttribute("currentTab", this.currentTab);

    this.render();
    this.addEventListeners();

    this.container = this.querySelector("div");
  }

  render() {
    this.innerHTML = `
      <div class="w-full">
        <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground;">
          ${this.tabs
            .map((tab) => `<tab-button tab-name="${tab}"></tab-button>`)
            .join("")}
        </div>
      </div>
    `;
  }

  addEventListeners() {
    const buttons = this.querySelectorAll("tab-button");
    buttons.forEach((button) => {
      button.addEventListener("click", this.handleTabClick.bind(this));
    });
  }

  handleTabClick(event) {
    this.currentTab = event.target.value;
    this.updateTabVisibility();
  }

  updateTabVisibility() {
    const contents = this.querySelectorAll("tab-content");
    contents.forEach((content) => {
      content.style.display =
        content.tabName === this.currentTab ? "block" : "none";
    });
    const buttons = this.querySelectorAll("tab-button");
    buttons.forEach((button) => {
      button.classList.toggle("active", button.value === this.currentTab);
    });
  }

  connectedCallback() {
    this.updateTabVisibility();
  }
}
customElements.define("tab-manager", TabManager);
