import "./styles/main.css";

import { Task, TaskList, LocalStorage } from "./modules/index";
import { TaskElement } from "./components/index";
import { STATES, TASKS } from "./consts";

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
$addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const { title, description, dueDate } = getFormData(event);

  const task = new Task(title, description, dueDate);

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
  { id, title, description, dueDate, state, location },
  list
) {
  const taskElement = `<task-element
      class="task-container"
      id="${id}"
      title="${title}" 
      due-date="${new Date(dueDate).toLocaleDateString()}"
      state="${state}"
      location="${location}" 
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
