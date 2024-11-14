import {
  CanvasElement,
  RecordElement,
  TabContent,
  TabManager,
  TaskElement,
} from '../components';
import { TAB_MANAGER_CONTENT } from '../consts';
import {
  createCopyButton,
  createInputField,
  createTextArea,
} from './dom/create-element';
import {
  addEventsDragStartDragEnd,
  createMap,
  editContentToMap,
  loadBlobFromLocalStorage,
  saveBlobToLocalStorage,
} from './index';

export function createTasks(tasks, target) {
  if (Array.isArray(tasks) && tasks.length > 0)
    tasks.forEach((task) => {
      addTaskElementToListElement(task, target);
    });
}

export function createTabManager() {
  const $main = document.getElementById('main');
  const $tabManager = new TabManager();
  const tabs = $tabManager.tabs;

  const $tabsContent = tabs.map((tab, i) => {
    const $tabContent = new TabContent(
      tab,
      TAB_MANAGER_CONTENT[i].title,
      TAB_MANAGER_CONTENT[i].description
    );

    return $tabContent;
  });

  $tabsContent.forEach(($tabContent) =>
    $tabManager.container.appendChild($tabContent)
  );

  $main.appendChild($tabManager);
}

export function addContentToDetails(details) {
  const $form = document.createElement('form');

  const $gridContainer = document.createElement('div');
  $gridContainer.classList.add('grid', 'w-full', 'items-center', 'gap-4');

  const $titleFieldContainer = document.createElement('div');
  $titleFieldContainer.classList.add(
    'max-w-80%',
    'flex',
    'flex-row',
    'gap-1',
    'items-center'
  );

  const $titleInput = createInputField({
    id: 'title',
    name: 'title',
    placeholder: 'Título de la tarea',
  });
  $titleInput.classList.add(
    'flex',
    'h-10',
    'w-full',
    'max-w-[80%]',
    'rounded-md',
    'border',
    'border-input',
    'bg-background',
    'px-3',
    'py-2',
    'text-sm',
    'ring-offset-background',
    'file:border-0',
    'file:bg-transparent',
    'file:text-sm',
    'file:font-medium',
    'file:text-foreground',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50'
  );
  $titleFieldContainer.appendChild($titleInput);

  // Botón para copiar el título
  const $titleCopyButton = createCopyButton('Copiar', $titleInput);
  $titleCopyButton.classList.add(
    'btn',
    'btn-copy',
    'text-xs',
    'py-1',
    'px-2',
    'rounded-md',
    'bg-blue-500',
    'text-white',
    'hover:bg-blue-600'
  );

  $titleFieldContainer.appendChild($titleCopyButton);

  const $descriptionFieldContainer = document.createElement('div');
  $descriptionFieldContainer.classList.add(
    'flex',
    'flex-row',
    'gap-1',
    'items-center'
  );

  const $descriptionTextarea = createTextArea({
    id: 'description',
    name: 'description',
    placeholder: 'Descripción de la tarea',
  });

  $descriptionTextarea.classList.add(
    'flex',
    'min-h-[80px]',
    'w-full',
    'max-w-[80%]',
    'rounded-md',
    'border',
    'border-input',
    'bg-background',
    'px-3',
    'py-2',
    'text-sm',
    'ring-offset-background',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50'
  );
  $descriptionFieldContainer.appendChild($descriptionTextarea);

  const $descriptionCopyButton = createCopyButton(
    'Copiar',
    $descriptionTextarea
  );
  $descriptionCopyButton.classList.add(
    'btn',
    'btn-copy',
    'text-xs',
    'py-1',
    'px-2',
    'rounded-md',
    'bg-blue-500',
    'text-white',
    'hover:bg-blue-600'
  );

  $descriptionFieldContainer.appendChild($descriptionCopyButton);

  const $dueDateFieldContainer = document.createElement('div');
  $dueDateFieldContainer.classList.add(
    'flex',
    'flex-row',
    'items-center',
    'gap-1.5'
  );
  const $dueDateInput = document.createElement('input');
  $dueDateInput.type = 'date';
  $dueDateInput.id = 'due-date';
  $dueDateInput.name = 'due-date';
  $dueDateFieldContainer.appendChild($dueDateInput);

  const $dueDateCopyButton = createCopyButton('Copiar', $dueDateInput);

  $dueDateCopyButton.classList.add(
    'btn',
    'btn-copy',
    'text-xs',
    'py-1',
    'px-2',
    'rounded-md',
    'bg-blue-500',
    'text-white',
    'hover:bg-blue-600'
  );

  $dueDateFieldContainer.appendChild($dueDateCopyButton);

  const $audioContainer = document.createElement('div');
  $audioContainer.classList.add('flex', 'flex-row', 'gap-1', 'items-center');

  const $record = new RecordElement(
    ({ id }) => {
      loadBlobFromLocalStorage(`${id}-audio`, 'application/octet-stream');
    },
    (data, { id }) => {
      saveBlobToLocalStorage(data, `${id}-audio`);
    }
  );

  $audioContainer.appendChild($record);

  $gridContainer.appendChild($titleFieldContainer);
  $gridContainer.appendChild($descriptionFieldContainer);
  $gridContainer.appendChild($dueDateFieldContainer);
  $gridContainer.appendChild($audioContainer);

  $form.appendChild($gridContainer);

  details.target.appendChild($form);
}

export function addContentToMap(map) {
  const $mapContainer = document.createElement('div');
  $mapContainer.classList.add(
    'w-full',
    'h-64',
    'md:h-96',
    'bg-gray-300',
    'flex',
    'items-center',
    'justify-center'
  );

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-8 w-8 text-gray-500" data-id="49"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

  const mapText = document.createElement('span');
  mapText.classList.add('ml-2');
  mapText.textContent = 'Mapa se mostrará aquí';

  $mapContainer.innerHTML = icon;
  $mapContainer.appendChild(mapText);

  window.LMap = createMap($mapContainer);

  map.target.appendChild($mapContainer);

  window.LMap.invalidateSize();
}

export function addContentToCanvas(canvas) {
  const $canvasElement = new CanvasElement();

  canvas.target.appendChild($canvasElement);

  const $buttonsContainer = document.createElement('div');
  $buttonsContainer.classList.add(
    'items-center',
    'p-6',
    'pt-0',
    'flex',
    'justify-between'
  );

  const $clearButton = document.createElement('button');
  $clearButton.id = 'clear-canvas';
  $clearButton.classList.add(
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'whitespace-nowrap',
    'rounded-md',
    'text-sm',
    'font-medium',
    'ring-offset-background',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
    'border',
    'border-input',
    'bg-background',
    'hover:bg-accent',
    'hover:text-accent-foreground',
    'h-10',
    'px-4',
    'py-2'
  );
  $clearButton.textContent = 'Limpiar';

  const $saveButton = document.createElement('button');
  $saveButton.id = 'save-canvas';
  $saveButton.classList.add(
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'whitespace-nowrap',
    'rounded-md',
    'text-sm',
    'font-medium',
    'ring-offset-background',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
    'bg-primary',
    'text-primary-foreground',
    'hover:bg-primary/90',
    'h-10',
    'px-4',
    'py-2'
  );
  $saveButton.textContent = 'Guardar Dibujo';

  $buttonsContainer.appendChild($clearButton);
  $buttonsContainer.appendChild($saveButton);

  const $article = canvas.querySelector('article');
  $article.insertAdjacentHTML('beforeend', $buttonsContainer.outerHTML);
}

export function toggleAddTaskFormVisibility(addTaskForm, addTask, isVisible) {
  addTaskForm.classList.toggle('active', isVisible);
  addTask.classList.toggle('active', !isVisible);
}

export function addTaskElementToListElement(task, list) {
  const $taskElement = createTaskElement(task);

  list.appendChild($taskElement);
}

export function createTaskElement(task) {
  const $taskElement = new TaskElement(
    task.id,
    task.title,
    task.description,
    task.dueDate,
    [task.latitude, task.longitude],
    task.state
  );

  addEventsDragStartDragEnd($taskElement);
  addEventChangeTabManagerContent($taskElement);

  return $taskElement;
}

function addEventChangeTabManagerContent(task) {
  task.addEventListener('click', (event) => changeTabManagerContent(event));
}

export function changeTabManagerContent(event) {
  const $taskElement = event.target;
  const id = $taskElement.getAttribute('id');

  const $tabManager = document.querySelector('tab-manager');
  const $details = document.querySelector('[tab-content-name=details]');
  const $canvas = document.querySelector('[tab-content-name=canvas]');

  $tabManager.setAttribute('task-id', id);

  if ($taskElement) {
    editContentToDetails($details, $taskElement);
    editContentToMap($taskElement);
    editContentToCanvas($canvas, $taskElement);
  }
}

function editContentToDetails($details, $taskElement) {
  const $title = $details.querySelector('[name=title]');
  const $description = $details.querySelector('[name=description');
  const $dueDate = $details.querySelector('[name=due-date]');
  const $record = $details.querySelector('record-element');

  $title.setAttribute('value', $taskElement.title);
  $description.value = $taskElement.description ?? '';
  $dueDate.setAttribute(
    'value',
    new Date($taskElement.dueDate).toISOString().split('T')[0]
  );

  const id = document.querySelector('tab-manager').getAttribute('task-id');
  const src = localStorage.getItem(`${id}-audio`);

  $record.setAttribute('task-id', id);
  $record.setAttribute('src', src ?? '');
}

function editContentToCanvas($canvas, $taskElement) {
  // traer de local storage sino dejarlo como estaba
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
