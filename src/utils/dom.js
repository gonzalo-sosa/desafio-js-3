import {
  CanvasElement,
  MapElement,
  TabContent,
  TabManager,
  TaskElement,
} from '../components';
import { TAB_MANAGER_CONTENT } from '../consts';
import { CanvasEditor, DetailsEditor } from '../modules/index';
import { MapEditor } from '../modules/MapEditor';
import {
  createAudioField,
  createButton,
  createDescriptionField,
  createDueDateField,
  createTitleField,
} from './dom/create-element';
import { addEventsDragStartDragEnd } from './index';

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

  const $titleFieldContainer = createTitleField();
  const $descriptionFieldContainer = createDescriptionField();
  const $dueDateFieldContainer = createDueDateField();
  const $audioContainer = createAudioField();

  $gridContainer.appendChild($titleFieldContainer);
  $gridContainer.appendChild($descriptionFieldContainer);
  $gridContainer.appendChild($dueDateFieldContainer);
  $gridContainer.appendChild($audioContainer);

  $form.appendChild($gridContainer);

  details.target.appendChild($form);
}

export function addContentToMap(map) {
  const $mapElement = new MapElement({
    latitude: -34.61315,
    longitude: -58.67723,
    initialZoom: 13,
  });

  map.target.appendChild($mapElement);
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

  const $clearButton = createButton({
    id: 'clear-canvas',
    type: 'button',
    text: ' Limpiar',
    classes: [
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
      'py-2',
    ],
  });

  const $saveButton = createButton({
    id: 'save-canvas',
    type: 'button',
    text: 'Guardar Dibujo',
    classes: [
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
      'py-2',
    ],
  });

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

export function updateTaskContentInTab($taskElement, $details, $canvas, $map) {
  const detailsEditor = new DetailsEditor();
  const canvasEditor = new CanvasEditor();
  const mapEditor = new MapEditor();

  detailsEditor.editContent($details, $taskElement);
  canvasEditor.editContent($canvas, $taskElement);
  mapEditor.editContent($map, $taskElement);
}

export function changeTabManagerContent(event) {
  const $taskElement = event.target;
  const id = $taskElement.getAttribute('id');

  const $tabManager = document.querySelector('tab-manager');
  const $details = document.querySelector('[tab-content-name=details]');
  const $canvas = document.querySelector('[tab-content-name=canvas]');
  const $map = document.querySelector('[tab-content-name=map]');

  $tabManager.setAttribute('task-id', id);

  if ($taskElement) {
    updateTaskContentInTab($taskElement, $details, $canvas, $map);
  }
}
