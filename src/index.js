import "./styles/main.css";

import { Task, TaskList, TaskElement } from "./components/Task/index";

const task1 = new Task("Tarea 1", "Esta es mi primer tarea", "10/10/2024");
const task2 = new Task("Tarea 2", "Esta es mi segunda tarea", "10/10/2024");
const task3 = new Task("Tarea 3", "Esta es mi tercera tarea", "10/10/2024");
const task4 = new Task("Tarea 4", "Esta es mi cuarta tarea", "10/10/2024");

var activeTaskList = new TaskList();
var completedTaskList = new TaskList();

activeTaskList.addTask(task1);
activeTaskList.addTask(task2);
activeTaskList.addTask(task3);
activeTaskList.addTask(task4);

const $taskList = document.getElementsByClassName("task-list")[0];

for (const task of activeTaskList.list) {
  const { title, description, dueDate, state, location } = task;

  $taskList.insertAdjacentHTML(
    "beforeend",
    `<task-element
      class="task-container"
      title="${title}" 
      due-date="${dueDate.toLocaleDateString()}"
      state="${state}"
      location="${location}" 
    >
    ${description}
    </task-element>`
  );
}
