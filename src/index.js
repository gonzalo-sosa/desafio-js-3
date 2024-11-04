import "./styles/main.css";

import { Task } from "./modules/Task";
import { TaskList } from "./modules/TaskList";
import { TaskElement } from "./components/index";
import { LocalStorage } from "./modules/LocalStorage";

// TODO: agregar al local storage cuando se cambia el estado de una tarea
// TODO: agregar ícono para borrar tarea

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

  $addTaskForm.classList.remove("active");
  $addTask.classList.add("active");
});

$addTask.addEventListener("click", function () {
  $addTaskForm.classList.add("active");
  $addTask.classList.remove("active");
});

function addTaskElementToListElement(
  { title, description, dueDate, state, location },
  list
) {
  const taskElement = `<task-element
      class="task-container"
      title="${title}" 
      due-date="${new Date(dueDate).toLocaleDateString()}"
      state="${state}"
      location="${location}" 
    >
    ${description}
    </task-element>`;

  list.insertAdjacentHTML("beforeend", taskElement);
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
