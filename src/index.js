import "./styles/main.css";

import { Task, TaskList, LocalStorage } from "./modules/index";
import { TaskElement } from "./components/index";
import { STATES } from "./consts";

const activeTaskList = new TaskList(
  JSON.parse(localStorage.getItem("tasks-active") || "[]")
);

const completedTaskList = new TaskList(
  JSON.parse(localStorage.getItem("tasks-completed") || "[]")
);

LocalStorage.save("tasks-active", activeTaskList.toString());
LocalStorage.save("tasks-completed", completedTaskList.toString());

const $taskListNew = document.getElementById("tasksNew");
const $taskListCompleted = document.getElementById("tasksCompleted");
const $addTask = document.getElementById("addTaskBtn");
const $addTaskForm = document.getElementById("addTaskForm");

// Cargar tareas
activeTaskList
  .getTasks()
  .forEach((task) => addTaskElementToListElement(task, $taskListNew));

completedTaskList
  .getTasks()
  .forEach((task) => addTaskElementToListElement(task, $taskListCompleted));

// Manejo del formulario para agregar tareas
$addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const { title, description, dueDate } = getFormData(event);

  const task = new Task(title, description, dueDate);

  activeTaskList.addTask(task);

  addTaskElementToListElement(task, $taskListNew);

  LocalStorage.save("tasks-active", activeTaskList.toString());

  toggleAddTaskFormVisibility(false);
});

$addTask.addEventListener("click", function () {
  toggleAddTaskFormVisibility(true);
});

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

  const task = activeTaskList.getTaskById(id);

  if (task) {
    task.state = state;
    LocalStorage.save("tasks-active", activeTaskList);
  }
});

// Evento de tarea eliminada
document.addEventListener("task-deleted", (event) => {
  const { id } = event.detail;

  const task = activeTaskList.getTaskById(id);

  if (task) {
    try {
      activeTaskList.removeTask(task);
      LocalStorage.save("tasks-active", activeTaskList);
    } catch (error) {
      console.error(error.message);
    }
  }
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
