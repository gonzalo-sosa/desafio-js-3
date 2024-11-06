import "./styles/main.css";

import { Task, TaskList, LocalStorage } from "./modules/index";
import { STATES, TASKS } from "./consts";
import { getPosition } from "./services/location";
import { TabContent, TabManager } from "./components/index";
import {
  getFormData,
  addContentToCanvas,
  addContentToDetails,
  addContentToMap,
  addTaskElementToListElement,
  toggleAddTaskFormVisibility,
  changeTabManagerContent,
} from "./utils/dom";
import * as L from "leaflet";

// Traer las tareas del local storage
const newTaskList = new TaskList(LocalStorage.load(TASKS.NEW, "[]"));
const inProgressTaskList = new TaskList(
  LocalStorage.load(TASKS.IN_PROGRESS, "[]")
);
const completedTaskList = new TaskList(
  LocalStorage.load(TASKS.COMPLETED, "[]")
);

// Guardar tareas en local storage
LocalStorage.save(TASKS.NEW, newTaskList.toString());
LocalStorage.save(TASKS.IN_PROGRESS, inProgressTaskList.toString());
LocalStorage.save(TASKS.COMPLETED, completedTaskList.toString());

// Obtener elementos y listas de tareas
const $sidebar = document.getElementById("sidebar");
const $taskList = document.getElementById("taskList");
const $taskListNew = document.getElementById("tasksNew");
const $taskListInProgress = document.getElementById("tasksInProgress");
const $taskListCompleted = document.getElementById("tasksCompleted");
const $addTask = document.getElementById("addTaskBtn");
const $addTaskForm = document.getElementById("addTaskForm");

// Cargar tareas
if (newTaskList.getTasks().length > 0)
  newTaskList.getTasks().forEach((task) => {
    addTaskElementToListElement(task, $taskListNew);
  });

if (inProgressTaskList.getTasks().length > 0)
  inProgressTaskList.getTasks().forEach((task) => {
    addTaskElementToListElement(task, $taskListInProgress);
  });

if (completedTaskList.getTasks().length > 0)
  completedTaskList.getTasks().forEach((task) => {
    addTaskElementToListElement(task, $taskListCompleted);
  });

// Agregar lista de tareas al sidebar
$sidebar.appendChild($taskList);

// Manejo del formulario para agregar tareas
$addTaskForm.addEventListener("submit", async (event) => {
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
});

$addTask.addEventListener("click", function () {
  toggleAddTaskFormVisibility($addTaskForm, $addTask, true);
});

// Evento de cambio de estado de tarea
document.addEventListener("state-changed", (event) => {
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

  // Remueve el elemento del DOM
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
document.addEventListener("task-deleted", (event) => {
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

const $main = document.getElementById("main");
const $tabManager = new TabManager();
const tabs = $tabManager.tabs;

const CONTENTS = [
  {
    title: "Detalles de la Tarea",
    description: "Edita los detalles de tu tarea aquí",
  },
  {
    title: "Ubicación de la Tarea",
    description: "Ver la ubicación en el mapa",
  },
  {
    title: "Área de Dibujo",
    description: "Dibuja algo relacionado con tu tarea",
  },
];

const $tabsContent = tabs.map((tab, i) => {
  const $tabContent = new TabContent(
    tab,
    CONTENTS[i].title,
    CONTENTS[i].description
  );

  return $tabContent;
});

$tabsContent.forEach(($tabContent) =>
  $tabManager.container.appendChild($tabContent)
);

$main.appendChild($tabManager);

const $details = document.querySelector("[tab-content-name=details]");
const $map = document.querySelector("[tab-content-name=map]");
const $canvas = document.querySelector("[tab-content-name=canvas]");

addContentToDetails($details);
const LMap = addContentToMap($map);
addContentToCanvas($canvas);

const $tasks = document.querySelectorAll("task-element");

$tasks.forEach(($task) => {
  $task.addEventListener("click", (event) =>
    changeTabManagerContent(event, undefined, LMap, undefined)
  );
});
