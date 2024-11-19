import * as L from 'leaflet';

export class MapElement extends HTMLElement {
  static get name() {
    return 'map-element';
  }

  constructor(mapOptions) {
    super();
    this.latitude =
      mapOptions?.latitude ?? Number(this.getAttribute('latitude'));
    this.longitude =
      mapOptions?.longitude ?? Number(this.getAttribute('longitude'));
    this.initialZoom =
      mapOptions?.initialZoom ?? Number(this.getAttribute('initial-zoom'));

    const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-8 w-8 text-gray-500" data-id="49"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    const text = `<span class="ml-2">El mapa se mostrará aquí</span>`;

    this.innerHTML = `<div class="w-full h-64 md:h-96 bg-gray-300 flex items-center justify-center">${icon}${text}</div>`;

    this.$container = this.querySelector('div');
  }

  connectedCallback() {
    this.map = L.map(this.$container).setView(
      [this.latitude, this.longitude],
      this.initialZoom,
      { animate: true }
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map);
  }
}

customElements.define(MapElement.name, MapElement);
