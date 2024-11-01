import "./styles/main.css";

import { Task, TaskList, TaskElement } from "./components/Task/index";

const task1 = new Task("Tarea 1", "Esta es mi primer tarea", "10/10/2024");
const task2 = new Task("Tarea 2", "Esta es mi segunda tarea", "10/10/2024");
const task3 = new Task("Tarea 3", "Esta es mi tercera tarea", "10/10/2024");
const task4 = new Task("Tarea 4", "Esta es mi cuarta tarea", "10/10/2024");

// TODO: agregar ícono para borrar tarea

var activeTaskList = new TaskList(
  JSON.parse(localStorage.getItem("tasks-active") || "[]")
);

var completedTaskList = new TaskList(
  JSON.parse(localStorage.getItem("tasks-completed") || "[]")
);

// activeTaskList.addTask(task1);
// activeTaskList.addTask(task2);
// activeTaskList.addTask(task3);

//completedTaskList.addTask(task4);

localStorage.setItem("tasks-active", activeTaskList.toString());
localStorage.setItem("tasks-completed", completedTaskList.toString());

// localStorage.clear(); // para evitar que se llene de tareas mientras se desarrolla la app

const $taskListNew = document.getElementById("tasksNew");
const $taskListCompleted = document.getElementById("tasksCompleted");

for (const task of activeTaskList.list) {
  addTaskElementToListElement(task, $taskListNew);
}

for (const task of completedTaskList.list) {
  addTaskElementToListElement(task, $taskListCompleted);
}

var $addTask = document.getElementById("addTaskBtn");
var $form = document.getElementById("addTaskForm");

$form.addEventListener("submit", (event) => {
  const { title, description, dueDate } = getFormData(event);
  console.log(title, description, dueDate);
  const task = new Task(title, description, dueDate);

  console.log({ task });

  activeTaskList.addTask(task);

  addTaskElementToListElement(task, $taskListNew);

  localStorage.setItem("tasks-active", activeTaskList.toString());

  $form.classList.remove("active");
  $addTask.classList.add("active");
});

$addTask.addEventListener("click", function () {
  $form.classList.add("active");
  $addTask.classList.remove("active");
});

function addTaskElementToListElement(
  { title, description, dueDate, state, location },
  list
) {
  list.insertAdjacentHTML(
    "beforeend",
    `<task-element
      class="task-container"
      title="${title}" 
      due-date="${new Date(dueDate).toLocaleDateString()}"
      state="${state}"
      location="${location}" 
    >
    ${description}
    </task-element>`
  );
}

function getFormData(event) {
  event.preventDefault();
  const $form = event.target;

  const data = new FormData($form);

  const title = data.get("title");
  const description = data.get("description");
  const dueDate = data.get("due-date");

  return {
    title,
    description,
    dueDate,
  };
}
