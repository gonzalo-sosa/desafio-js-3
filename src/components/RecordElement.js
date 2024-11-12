export class RecordElement extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  constructor(onLoad, onStop) {
    super();
    this.onLoad = onLoad;
    this.onStop = onStop;
    this.mediaRecorder;
    this.recordedChunks = [];

    this.innerHTML = `<div><button id="startBtn" class="btn btn-record text-xs py-1 px-2 rounded-md bg-green-500 text-white hover:bg-green-600" type="button">Grabar</button><button id="stopBtn" class="btn btn-record text-xs py-1 px-2 rounded-md bg-red-500 text-white hover:bg-red-600" type="button">Detener</button><audio controls id="audioPlayback"></audio></div>`;

    this.$startBtn = this.querySelector('#startBtn');
    this.$stopBtn = this.querySelector('#stopBtn');
    this.$audioPlayback = this.querySelector('#audioPlayback');
  }

  async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(blob);
      this.$audioPlayback.src = audioURL;
      this.recordedChunks = [];
      if (this.hasAttribute('task-id')) {
        this.onStop(blob, { id: this.getAttribute('task-id') });
      }
    };

    this.mediaRecorder.start();
    this.$startBtn.disabled = true;
    this.$stopBtn.disabled = false;
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.$startBtn.disabled = false;
    this.$stopBtn.disabled = true;
  }

  connectedCallback() {
    this.$startBtn.addEventListener('click', () => this.startRecording());
    this.$stopBtn.addEventListener('click', () => this.stopRecording());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && oldValue !== newValue) {
      this.onLoad({ id: this.getAttribute('id') });
      this.$audioPlayback.src = newValue;
      this.$audioPlayback.load();
    }
  }
}

customElements.define('record-element', RecordElement);
