import "./styles/main.css";

import { Task, TaskList, LocalStorage } from "./modules/index";
import { TaskElement } from "./components/index";
import { STATES, STATES_COLOR, TASKS } from "./consts";
import { getPosition } from "./services/location";

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

// Obtener listas de tareas (ul)
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

  toggleAddTaskFormVisibility(false);
});

$addTask.addEventListener("click", function () {
  toggleAddTaskFormVisibility(true);
});

/**
 * @param {Task} obj
 * @param {TaskList} list
 *
 */
function addTaskElementToListElement(
  { id, title, description, dueDate, state, latitude, longitude },
  list
) {
  const taskElement = `<task-element
      class="task-container"
      id="${id}"
      title="${title}" 
      due-date="${new Date(dueDate).toLocaleDateString()}"
      state="${state}"
      latitude="${latitude}" 
      longitude="${longitude}"
    >
    ${description}
    </task-element>`;

  list.insertAdjacentHTML("beforeend", taskElement);
}

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

function toggleAddTaskFormVisibility(isVisible) {
  $addTaskForm.classList.toggle("active", isVisible);
  $addTask.classList.toggle("active", !isVisible);
}

function getFormData(event) {
  const $addTaskForm = event.target;

  const data = new FormData($addTaskForm);

  const title = data.get("title");
  const description = data.get("description");
  const dueDate = data.get("due-date");

  return {
    title,
    description,
    dueDate,
  };
}

// Mapa
const $map = document.getElementById("map");
$map.style.height = "300px";

const latitude = -34.61315;
const longitude = -58.67723;

const map = L.map($map, {
  center: [latitude, longitude],
  zoom: 10,
  minZoom: 10,
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// TODO: para cada tarea crear un marker del color de la tarea
// TODO: cuando se elimina tarea también eliminar los markers

const markersForNew = newTaskList
  .getTasks()
  .map((task) => createMarkerInMapForTask(task));

const markersForInProgress = inProgressTaskList
  .getTasks()
  .map((task) => createMarkerInMapForTask(task));

const markersForCompleted = completedTaskList
  .getTasks()
  .map((task) => createMarkerInMapForTask(task));

function createMarkerInMapForTask(task) {
  const circle = L.circle(L.latLng(task.latitude, task.longitude), {
    color: STATES_COLOR[task.state],
    fillColor: STATES_COLOR[task.state],
    fillOpacity: 0.5,
    radius: 5,
  }).addTo(map);

  const marker = L.marker(L.latLng(task.latitude, task.longitude), {
    alt: task.title,
    title: task.title,
  }).addTo(map);

  return [circle, marker];
}
