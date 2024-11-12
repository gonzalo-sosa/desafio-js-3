export class NotificationElement extends HTMLElement {
  static get observedAttributes() {
    return ['connected'];
  }

  constructor() {
    super();
    this.connected = this.getAttribute('connected') === 'true';

    this.innerHTML = `
      <div class="notification__content mb-4 flex justify-between items-center">
      </div>
    `;

    this.$content = this.querySelector('.notification__content');
    this.$content.innerHTML = `
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell h-4 w-4" data-id="15"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
        </button>`;

    this.btn = this.$content.querySelector('button');
  }

  changeBtn(permission) {
    if (permission === 'denied' || permission === 'default') {
      this.btn.style.display = 'inline-flex';
    } else {
      this.btn.style.display = 'none';
    }
  }
}

customElements.define('notification-element', NotificationElement);
