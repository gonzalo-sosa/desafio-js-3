import "./styles/main.css";

import { Task, TaskList, LocalStorage } from "./modules/index";
import { STATES, TASKS } from "./consts";
import { getPosition } from "./services/location";
import { TabContent, TabManager, TaskElement } from "./components/index";
import {
  getFormData,
  addContentToCanvas,
  addContentToDetails,
  addContentToMap,
  addTaskElementToListElement,
  toggleAddTaskFormVisibility,
  changeTabManagerContent,
  handleDropTask,
  handleDragOverTask,
  handleDragLeaveTask,
  addEventsDragStartDragEnd,
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

// traer las tareas desde la conexión web socket si es que existen

const ws = new WebSocket(`ws://${process.env.SERVER_IP}:${process.env.PORT}`);

ws.onopen = (event) => {
  console.log("Conectado al web socket");
};

ws.onmessage = (event) => {
  console.log("Mensaje recibido: ", event);
  const data = JSON.parse(event.data);
  console.log(data);

  // agregar las tareas a la lista correspondiente según su estado

  switch (data.state) {
    case STATES.NEW:
      addTaskElementToListElement(data, $taskListNew);
      break;
    case STATES.IN_PROGRESS:
      addTaskElementToListElement(data, $taskListInProgress);
      break;
    case STATES.COMPLETED:
      addTaskElementToListElement(data, $taskListCompleted);
      break;
  }
};

ws.onerror = (event) => {
  console.error(event);
};

ws.onclose = (event) => {
  console.log("Conexión cerrada", event);
};

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

  // enviar datos a web socket del servidor node
  // enviar desde el servidor node los datos a los cliente menos al actual

  // TODO: detectar desde que ip se hace la conexión
  // si la ip coincide con el servidor enviar al local
  // si la ip no coincide con el servidor enviar al servidor

  const ws = new WebSocket(`ws://${process.env.LOCAL_IP}:${process.env.PORT}`);

  ws.onopen = (event) => {
    console.log("Conectado al servidor WebSocket", event);

    ws.send(JSON.stringify(task));
  };

  ws.onerror = (event) => {
    console.log("Conexión WebSocket cerrada: ", event);
  };

  ws.onclose = () => {
    console.log("Desconectado del servidor WebSocket");
  };

  new Notification("Lista de tareas", {
    body: "Nueva tarea: " + task.title,
  });

  //ws.close();
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
    changeTabManagerContent(
      event,
      { newTaskList, inProgressTaskList, completedTaskList },
      $details,
      LMap,
      $canvas
    )
  );
});

const $canvasElement = document.querySelector("canvas");

const context = $canvasElement.getContext("2d");
let initialX;
let initialY;

const dibujar = (x, y) => {
  context.beginPath();
  context.moveTo(initialX, initialY);
  context.lineWidth = 5;
  context.strokeStyle = "#000";
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineTo(x, y);
  context.stroke();

  initialX = x;
  initialY = y;
};

const mouseDown = (event) => {
  initialX = event.offsetX;
  initialY = event.offsetY;
  dibujar(initialX, initialY);
  $canvasElement.addEventListener("mousemove", mouseMoving);
};

const mouseMoving = (event) => {
  dibujar(event.offsetX, event.offsetY);
};

const mouseUp = () => {
  $canvasElement.removeEventListener("mousemove", mouseMoving);
};

$canvasElement.addEventListener("mousedown", mouseDown);
$canvasElement.addEventListener("mouse", mouseUp);

const $clearCanvas = document.getElementById("clear-canvas");
const $saveCanvas = document.getElementById("save-canvas");

$clearCanvas.addEventListener("click", handleClearCanvas);
$saveCanvas.addEventListener("click", handleSaveCanvas);

function handleClearCanvas(event) {
  const $canvas = document.querySelector("canvas");
  const context = $canvas.getContext("2d");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, $canvas.width, $canvas.height);
  context.clearRect(0, 0, $canvas.width, $canvas.height);
}

function handleSaveCanvas(event) {
  const $canvas = document.querySelector("canvas");
  const imageData = $canvas.toDataURL("image/png");
  const $tabManager = document.querySelector("tab-manager");
  const taskId = $tabManager.getAttribute("task-id");
  LocalStorage.save(`${taskId}-canvas`, imageData);
}

// a cada tarea le agrego los eventos de dragstart y drag end

const $taskElements = document.querySelectorAll("task-element");

$taskElements.forEach(($task) => {
  addEventsDragStartDragEnd($task);
});

// para cada lista de tareas escucho el evento drop

$taskListNew.addEventListener("drop", handleDropTask);
$taskListInProgress.addEventListener("drop", handleDropTask);
$taskListCompleted.addEventListener("drop", handleDropTask);

// para cada lista de tareas escucho el evento de dragover

$taskListNew.addEventListener("dragover", handleDragOverTask);
$taskListInProgress.addEventListener("dragover", handleDragOverTask);
$taskListCompleted.addEventListener("dragover", handleDragOverTask);

// para cada lista de tareas escucho el evento dragleave

$taskListNew.addEventListener("dragleave", handleDragLeaveTask);
$taskListInProgress.addEventListener("dragleave", handleDragLeaveTask);
$taskListCompleted.addEventListener("dragleave", handleDragLeaveTask);

const $notificationElement = document.querySelector("notification-element");

$notificationElement.addEventListener("click", () => {
  if (!("Notification" in window)) {
    console.log("Este navegador no admite notificaciones.");
  } else {
    Notification.requestPermission().then((permission) => {
      $notificationElement.changeBtn(permission);
    });
  }
});
