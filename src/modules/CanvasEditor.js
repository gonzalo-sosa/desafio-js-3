import { ContentEditor } from './ContentEditor';

export class CanvasEditor extends ContentEditor {
  editContent($tabContent, $taskElement) {
    const $canvas = $tabContent;
    const $canvasElement = $canvas.querySelector('canvas-element');
    const id = $taskElement.getAttribute('id');
    const canvasData = localStorage.getItem(`${id}-canvas`);

    $canvasElement.id = id;

    // Limpiar canvas antes de cargar imagen
    let context = $canvasElement.context;
    context.fillStyle = '#fff';
    context.fillRect(
      0,
      0,
      $canvasElement.$canvas.width,
      $canvasElement.$canvas.height
    );
    context.clearRect(
      0,
      0,
      $canvasElement.$canvas.width,
      $canvasElement.$canvas.height
    );

    if (canvasData) {
      let img = new Image();

      img.onload = function () {
        let context = $canvasElement.context;
        context.drawImage(img, 0, 0);
      };

      img.src = canvasData;
    }
  }
}
