import './styles/main.css';

import { Task, TaskList, LocalStorage } from './modules/index';
import { STATES, TASKS } from './consts';
import { getPosition } from './services/location';
import {
  addContentToCanvas,
  addContentToDetails,
  addContentToMap,
  addTaskElementToListElement,
  toggleAddTaskFormVisibility,
  addEventsDragStartDragEnd,
  createTabManager,
  createTasks,
  getFormData,
  handleDragLeaveTask,
  handleDragOverTask,
  handleDropTask,
} from './utils/index';

// Traer las tareas del local storage
const newTaskList = new TaskList(LocalStorage.load(TASKS.NEW, '[]'));
const inProgressTaskList = new TaskList(
  LocalStorage.load(TASKS.IN_PROGRESS, '[]')
);
const completedTaskList = new TaskList(
  LocalStorage.load(TASKS.COMPLETED, '[]')
);

const worker = new Worker(
  new URL('./services/web-socket-worker.js', import.meta.url)
);

worker.postMessage('get_tasks');

worker.onmessage = (e) => {
  const { data } = e;

  if (data) {
    const task = data.task;

    // Buscar si esta tarea ya existe
    // Si ya existe no agregarla

    switch (task._state) {
      case STATES.NEW:
        if (!newTaskList.getTaskById(task._id))
          addTaskElementToListElement(task, $taskListNew);
        break;
      case STATES.IN_PROGRESS:
        if (!inProgressTaskList.getTaskById(task._id))
          addTaskElementToListElement(task, $taskListInProgress);
        break;
      case STATES.COMPLETED:
        if (!completedTaskList.getTaskById(task._id))
          addTaskElementToListElement(task, $taskListCompleted);
        break;
      default:
        console.log('Estado de tarea desconocido', task._state);
        break;
    }
  }
};

// Guardar tareas en local storage
LocalStorage.save(TASKS.NEW, newTaskList.toString());
LocalStorage.save(TASKS.IN_PROGRESS, inProgressTaskList.toString());
LocalStorage.save(TASKS.COMPLETED, completedTaskList.toString());

// Obtener elementos y listas de tareas
const $sidebar = document.getElementById('sidebar');
const $taskList = document.getElementById('taskList');
const $taskListNew = document.getElementById('tasksNew');
const $taskListInProgress = document.getElementById('tasksInProgress');
const $taskListCompleted = document.getElementById('tasksCompleted');
const $addTask = document.getElementById('addTaskBtn');
const $addTaskForm = document.getElementById('addTaskForm');

// Crear tareas
createTasks(newTaskList.getTasks(), $taskListNew);
createTasks(inProgressTaskList.getTasks(), $taskListInProgress);
createTasks(completedTaskList.getTasks(), $taskListCompleted);

// Agregar lista de tareas al sidebar
$sidebar.appendChild($taskList);

// Manejo del formulario para agregar tareas
$addTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const { title, description, dueDate } = getFormData(event);

  const [latitude, longitude] = await getPosition().then(
    (position) => position
  );

  const task = new Task(title, description, dueDate, latitude, longitude);

  newTaskList.addTask(task);

  addTaskElementToListElement(task, $taskListNew);

  LocalStorage.save(TASKS.NEW, newTaskList.toString());

  toggleAddTaskFormVisibility($addTaskForm, $addTask, false);

  // usar worker
  if (window.Worker) {
    const wsWorker = new Worker(
      new URL('./services/web-socket-worker.js', import.meta.url)
    );

    wsWorker.postMessage(task);

    wsWorker.onmessage = (e) => {
      const { data } = e;
      if (data.type === 'TASK_SENT')
        console.log('Tarea enviada correctamente: ', { ...data });
      else console.log('Tarea enviada incorrectamente.');
    };

    const notificationWorker = new Worker(
      new URL('./services/notification-worker.js', import.meta.url)
    );

    notificationWorker.postMessage(task);
  } else {
    new Notification('Lista de tareas', {
      body: `Nueva tarea ${
        task.title
      } con expiración el ${task.dueDate.toLocaleString()}`,
    });
  }
  //ws.close();
});

$addTask.addEventListener('click', function () {
  toggleAddTaskFormVisibility($addTaskForm, $addTask, true);
});

// Evento de cambio de estado de tarea
document.addEventListener('state-changed', (event) => {
  const { id, state } = event.detail;

  let task = newTaskList.getTaskById(id);

  if (!task) {
    task = inProgressTaskList.getTaskById(id);
    if (task) {
      inProgressTaskList.removeTask(task);
    }
  } else {
    newTaskList.removeTask(task);
  }

  if (!task) {
    task = completedTaskList.getTaskById(id);
    if (task) {
      completedTaskList.removeTask(task);
    }
  }

  if (!task) {
    return;
  }

  task.state = state;

  // Quitar el elemento del DOM
  const taskElement = document.querySelector(`task-element[id="${id}"]`);
  if (taskElement) {
    taskElement.remove();
  }

  // Agrega la tarea a la nueva lista
  if (state === STATES.NEW) {
    newTaskList.addTask(task);
    $taskListNew.appendChild(taskElement);
  }

  if (state === STATES.IN_PROGRESS) {
    inProgressTaskList.addTask(task);
    $taskListInProgress.appendChild(taskElement);
  }

  if (state === STATES.COMPLETED) {
    completedTaskList.addTask(task);
    $taskListCompleted.appendChild(taskElement);
  }

  LocalStorage.save(TASKS.NEW, newTaskList.toString());
  LocalStorage.save(TASKS.IN_PROGRESS, inProgressTaskList.toString());
  LocalStorage.save(TASKS.COMPLETED, completedTaskList.toString());
});

// Evento de tarea eliminada
document.addEventListener('task-deleted', (event) => {
  const { id } = event.detail;

  let task = newTaskList.getTaskById(id);

  if (!task) {
    task = inProgressTaskList.getTaskById(id);
    if (task) {
      inProgressTaskList.removeTask(task);
    }
  } else {
    newTaskList.removeTask(task);
  }

  if (!task) {
    task = completedTaskList.getTaskById(id);
    if (task) {
      completedTaskList.removeTask(task);
    }
  }

  LocalStorage.save(TASKS.NEW, newTaskList.toString());
  LocalStorage.save(TASKS.IN_PROGRESS, inProgressTaskList.toString());
  LocalStorage.save(TASKS.COMPLETED, completedTaskList.toString());
});

createTabManager();

const $details = document.querySelector('[tab-content-name=details]');
const $map = document.querySelector('[tab-content-name=map]');
const $canvas = document.querySelector('[tab-content-name=canvas]');

addContentToDetails($details);
addContentToMap($map);
addContentToCanvas($canvas);

/*
CREAR CANVAS
*/
const $clearCanvas = document.getElementById('clear-canvas');
const $saveCanvas = document.getElementById('save-canvas');

const $canvasElement = document.querySelector('canvas-element');

$canvasElement.onSave = (id, imageData) => {
  LocalStorage.save(`${id}-canvas`, imageData);
};

$clearCanvas.addEventListener('click', () =>
  $canvasElement.handleClearCanvas()
);
$saveCanvas.addEventListener('click', () => $canvasElement.handleSaveCanvas());

// A cada tarea le agrego los eventos de dragstart y drag end
const $taskElements = document.querySelectorAll('task-element');

$taskElements.forEach(($task) => {
  addEventsDragStartDragEnd($task);
});

// Para cada lista de tareas escucho el evento drop

$taskListNew.addEventListener('drop', handleDropTask);
$taskListInProgress.addEventListener('drop', handleDropTask);
$taskListCompleted.addEventListener('drop', handleDropTask);

// Para cada lista de tareas escucho el evento de dragover

$taskListNew.addEventListener('dragover', handleDragOverTask);
$taskListInProgress.addEventListener('dragover', handleDragOverTask);
$taskListCompleted.addEventListener('dragover', handleDragOverTask);

// Para cada lista de tareas escucho el evento dragleave

$taskListNew.addEventListener('dragleave', handleDragLeaveTask);
$taskListInProgress.addEventListener('dragleave', handleDragLeaveTask);
$taskListCompleted.addEventListener('dragleave', handleDragLeaveTask);

const $notificationElement = document.querySelector('notification-element');

$notificationElement.addEventListener('click', () => {
  if (!('Notification' in window)) {
    console.log('Este navegador no admite notificaciones.');
  } else {
    Notification.requestPermission().then((permission) => {
      $notificationElement.changeBtn(permission);
    });
  }
});
