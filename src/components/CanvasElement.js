export class CanvasElement extends HTMLElement {
  constructor(onClear, onSave) {
    super();
    this.onClear = onClear;
    this.onSave = onSave;
    this.initialX = 0;
    this.initialY = 0;

    this.classList.add(
      'w-full',
      'h-64',
      'bg-white',
      'border-2',
      'border-dashed',
      'border-gray-300',
      'flex',
      'items-center',
      'justify-center'
    );
    this.innerHTML = `<canvas></canvas>`;

    this.$canvas = this.querySelector('canvas');
    this.context = this.$canvas.getContext('2d');
  }

  dibujar(dx, dy) {
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
    this.dibujar(this.initialX, this.initialY);

    this.$canvas.addEventListener('mousemove', (event) =>
      this.mouseMoving(event)
    );
  }

  mouseMoving(event) {
    this.dibujar(event.offsetX, event.offsetY);
  }

  mouseUp() {
    this.$canvas.removeEventListener('mousemove', () => this.mouseMoving());
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
    this.$canvas.addEventListener('mouse', () => this.mouseUp());
  }

  setCanvasSize() {
    const elementWidth = this.offsetWidth;
    const elementHeight = this.offsetHeight;

    if (!this.$canvas.width || !this.$canvas.height) {
      this.$canvas.width = elementWidth;
      this.$canvas.height = elementHeight;
    }
  }

  handleClearCanvas() {
    this.context.fillStyle = '#fff';
    this.context.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
    this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

    if (this.onClear) this.onClear();
  }

  handleSaveCanvas() {
    const imageData = this.$canvas.toDataURL('image/png');
    this.onSave(this.id, imageData);
  }
}

customElements.define('canvas-element', CanvasElement);
