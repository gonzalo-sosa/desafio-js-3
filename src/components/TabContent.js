export class TabContent extends HTMLElement {
  constructor(tabName, title, description) {
    super();
    this.tabName = tabName;
    this.title = title ?? '';
    this.description = description ?? '';

    this.setAttribute('tab-content-name', this.tabName);

    this.render();

    this.target = this.querySelector('.target');
  }

  render() {
    this.innerHTML = `
      <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value="${this.tabName}">
        <article class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <header class="flex flex-col space-y-1.5 p-6">
              <h3 class="text-2xl font-semibold leading-none tracking-tight">${this.title}</h3>
              <p class="text-sm text-muted-foreground">${this.description}</p>
            </header>
            <div class="target p-6 pt-0">
            </div>
          </article>
      </div>
    `;
  }
}
customElements.define('tab-content', TabContent);
