export class CanvasElement extends HTMLElement {
  constructor(onClear, onSave) {
    super();
    this.onClear = onClear;
    this.onSave = onSave;
    this.initialX = 0;
    this.initialY = 0;
    this.mouseMoveHandler = this.mouseMoving.bind(this);

    this.classList.add(
      'w-full',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'gap-4'
    );
    this.innerHTML = /*html*/ `<div class="w-full h-64 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center">
        <canvas></canvas>
    </div>`;

    this.$container = this.querySelector('div');
    this.$canvas = this.querySelector('canvas');
    this.context = this.$canvas.getContext('2d');
  }

  draw(dx, dy) {
    this.context.beginPath();
    this.context.moveTo(this.initialX, this.initialY);
    this.context.lineWidth = 5;
    this.context.strokeStyle = '#000';
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.lineTo(dx, dy);
    this.context.stroke();

    this.initialX = dx;
    this.initialY = dy;
  }

  mouseDown(event) {
    this.initialX = event.offsetX;
    this.initialY = event.offsetY;
    this.draw(this.initialX, this.initialY);

    this.$canvas.addEventListener('mousemove', this.mouseMoveHandler);
  }

  mouseMoving(event) {
    this.draw(event.offsetX, event.offsetY);
  }

  mouseUp() {
    this.$canvas.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  connectedCallback() {
    this.id = this.getAttribute('id');
    this.setCanvasSize();

    window.addEventListener('resize', () => {
      this.setCanvasSize();
    });

    this.$canvas.addEventListener('mousedown', (event) =>
      this.mouseDown(event)
    );
    this.$canvas.addEventListener('mouseup', () => this.mouseUp());
  }

  setCanvasSize() {
    const elementWidth = this.$container.offsetWidth;
    const elementHeight = this.$container.offsetHeight;

    this.$canvas.width = elementWidth - 24; // Se resta el tamaño del borde
    this.$canvas.height = elementHeight - 8; // Se resta el tamaño del borde
  }

  handleClearCanvas() {
    this.context.fillStyle = '#fff';
    this.context.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
    this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

    if (this.onClear) this.onClear();
  }

  handleSaveCanvas() {
    const imageData = this.$canvas.toDataURL('image/png');
    if (this.onSave) this.onSave(this.id, imageData);
  }
}

customElements.define('canvas-element', CanvasElement);
