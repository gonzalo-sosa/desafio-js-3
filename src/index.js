import "./styles/main.css";

import { Task } from "./components/Task";
import { TaskList } from "./components/TaskList";
import { TaskElement } from "./components/TaskElement"; // importar si o si

const task1 = new Task("Tarea 1", "Esta es mi primer tarea", "10/10/2024");
const task2 = new Task("Tarea 2", "Esta es mi segunda tarea", "10/10/2024");
const task3 = new Task("Tarea 3", "Esta es mi tercera tarea", "10/10/2024");

var activeTaskList = new TaskList();
var completedTaskList = new TaskList();

activeTaskList.addTask(task1);
activeTaskList.addTask(task2);
activeTaskList.addTask(task3);

const $taskList = document.getElementById("task-list");

for (const task of activeTaskList.list) {
  const { title, description, expirationDate, state } = task;

  $taskList.insertAdjacentHTML(
    "beforeend",
    `<task-element
      class="task-container"
      title="${title}" 
      expiration-date="${expirationDate.toLocaleDateString()}"
      state="${state}" 
    >
    ${description}
    </task-element>`
  );
}
