import { TaskElement } from "../components";
import { STATES } from "../consts";

export function addContentToDetails(details) {
  const $form = document.createElement("form");

  const $gridContainer = document.createElement("div");
  $gridContainer.classList.add("grid", "w-full", "items-center", "gap-4");

  const $titleFieldContainer = document.createElement("div");
  $titleFieldContainer.classList.add("flex", "flex-col", "space-y-1.5");
  const $titleInput = document.createElement("input");
  $titleInput.type = "text";
  $titleInput.id = "title";
  $titleInput.name = "title";
  $titleInput.placeholder = "Título de la tarea";
  $titleInput.classList.add(
    "flex",
    "h-10",
    "w-full",
    "rounded-md",
    "border",
    "border-input",
    "bg-background",
    "px-3",
    "py-2",
    "text-sm",
    "ring-offset-background",
    "file:border-0",
    "file:bg-transparent",
    "file:text-sm",
    "file:font-medium",
    "file:text-foreground",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50"
  );
  $titleFieldContainer.appendChild($titleInput);

  const $descriptionFieldContainer = document.createElement("div");
  $descriptionFieldContainer.classList.add("flex", "flex-col", "space-y-1.5");
  const $descriptionTextarea = document.createElement("textarea");
  $descriptionTextarea.id = "description";
  $descriptionTextarea.name = "description";
  $descriptionTextarea.placeholder = "Descripción de la tarea";
  $descriptionTextarea.classList.add(
    "flex",
    "min-h-[80px]",
    "w-full",
    "rounded-md",
    "border",
    "border-input",
    "bg-background",
    "px-3",
    "py-2",
    "text-sm",
    "ring-offset-background",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50"
  );
  $descriptionFieldContainer.appendChild($descriptionTextarea);

  const $dueDateFieldContainer = document.createElement("div");
  $dueDateFieldContainer.classList.add("grid", "gap-1.5");
  const $dueDateInput = document.createElement("input");
  $dueDateInput.type = "date";
  $dueDateInput.id = "due-date";
  $dueDateInput.name = "due-date";
  $dueDateFieldContainer.appendChild($dueDateInput);

  $gridContainer.appendChild($titleFieldContainer);
  $gridContainer.appendChild($descriptionFieldContainer);
  $gridContainer.appendChild($dueDateFieldContainer);

  $form.appendChild($gridContainer);

  details.target.appendChild($form);
}

export function addContentToMap(map) {
  const $mapContainer = document.createElement("div");
  $mapContainer.classList.add(
    "w-full",
    "h-64",
    "md:h-96",
    "bg-gray-300",
    "flex",
    "items-center",
    "justify-center"
  );

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-8 w-8 text-gray-500" data-id="49"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

  const mapText = document.createElement("span");
  mapText.classList.add("ml-2");
  mapText.textContent = "Mapa se mostrará aquí";

  $mapContainer.innerHTML = icon;
  $mapContainer.appendChild(mapText);

  const LMap = createMap($mapContainer);

  map.target.appendChild($mapContainer);

  LMap.invalidateSize();

  return LMap;
}

function createMap(container, latitude = -34.61315, longitude = -58.67723) {
  const lMap = L.map(container, {}).setView([latitude, longitude], 13, {
    animate: true,
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 10,
    maxZoom: 20,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(lMap);

  return lMap;
}

export function addContentToCanvas(canvas) {
  const $drawingAreaContainer = document.createElement("div");
  $drawingAreaContainer.id = "canvas";
  $drawingAreaContainer.classList.add(
    "w-full",
    "h-64",
    "bg-white",
    "border-2",
    "border-dashed",
    "border-gray-300",
    "flex",
    "items-center",
    "justify-center"
  );

  const $canvas = document.createElement("canvas");
  $canvas.width = 200;
  $canvas.height = 100;

  $drawingAreaContainer.appendChild($canvas);
  /*
  const $drawingAreaText = document.createElement("span");
  $drawingAreaText.classList.add("ml-2");
  $drawingAreaText.textContent = "Área de dibujo";

  $drawingAreaContainer.appendChild($drawingAreaText);
  */
  canvas.target.appendChild($drawingAreaContainer);

  const $buttonsContainer = document.createElement("div");
  $buttonsContainer.classList.add(
    "items-center",
    "p-6",
    "pt-0",
    "flex",
    "justify-between"
  );

  const $clearButton = document.createElement("button");
  $clearButton.id = "clear-canvas";
  $clearButton.classList.add(
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "whitespace-nowrap",
    "rounded-md",
    "text-sm",
    "font-medium",
    "ring-offset-background",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "[&_svg]:pointer-events-none",
    "[&_svg]:size-4",
    "[&_svg]:shrink-0",
    "border",
    "border-input",
    "bg-background",
    "hover:bg-accent",
    "hover:text-accent-foreground",
    "h-10",
    "px-4",
    "py-2"
  );
  $clearButton.textContent = "Limpiar";

  const $saveButton = document.createElement("button");
  $saveButton.id = "save-canvas";
  $saveButton.classList.add(
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "whitespace-nowrap",
    "rounded-md",
    "text-sm",
    "font-medium",
    "ring-offset-background",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "[&_svg]:pointer-events-none",
    "[&_svg]:size-4",
    "[&_svg]:shrink-0",
    "bg-primary",
    "text-primary-foreground",
    "hover:bg-primary/90",
    "h-10",
    "px-4",
    "py-2"
  );
  $saveButton.textContent = "Guardar Dibujo";

  $buttonsContainer.appendChild($clearButton);
  $buttonsContainer.appendChild($saveButton);

  const $article = canvas.querySelector("article");
  $article.insertAdjacentHTML("beforeend", $buttonsContainer.outerHTML);
}

export function toggleAddTaskFormVisibility(addTaskForm, addTask, isVisible) {
  addTaskForm.classList.toggle("active", isVisible);
  addTask.classList.toggle("active", !isVisible);
}

export function getFormData(event) {
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

export function addTaskElementToListElement(task, list) {
  const $taskElement = createTaskElement(task);

  list.appendChild($taskElement);
}

export function createTaskElement(task) {
  const $taskElement = new TaskElement(
    task.id,
    task.title,
    task.description,
    task.dueDate,
    [task.latitude, task.longitude],
    task.state
  );

  addEventsDragStartDragEnd($taskElement);

  return $taskElement;
}

export function changeTabManagerContent(
  event,
  { newTaskList, inProgressTaskList, completedTaskList },
  details,
  map,
  canvas
) {
  const $taskElement = event.target;
  const state = $taskElement.getAttribute("state");
  const id = $taskElement.getAttribute("id");

  // busco el task con las listas
  let task = null;
  switch (state) {
    case STATES.NEW:
      task = newTaskList.getTaskById(id);
      break;

    case STATES.IN_PROGRESS:
      task = inProgressTaskList.getTaskById(id);
      break;

    case STATES.COMPLETED:
      task = completedTaskList.getTaskById(id);
      break;
  }

  const $tabManager = document.querySelector("tab-manager");
  const $details = $tabManager.querySelector("[tab-content-name=details]");
  const $canvas = $tabManager.querySelector("canvas");

  $tabManager.setAttribute("task-id", id);

  map.invalidateSize();

  editContentToDetails($details, task);
  editViewToMap(map, task);
  addMarkerToMap(map, task);
  editContentToCanvas($canvas, id);
}

function editContentToDetails($details, task) {
  const $title = $details.querySelector("[name=title]");
  const $description = $details.querySelector("[name=description");
  const $dueDate = $details.querySelector("[name=due-date]");

  $title.setAttribute("value", task.title);
  $description.value = task.description ?? "";
  $dueDate.setAttribute(
    "value",
    new Date(task.dueDate).toISOString().split("T")[0]
  );
}

function editViewToMap(map, task) {
  map.setView([task.latitude, task.longitude], 15);
}

export var markers = {};

function addMarkerToMap(map, task) {
  if (!markers[task.id]) {
    L.marker([task.latitude, task.longitude]).addTo(map);
    markers[`${task.id}`] = true;
  }
}

function editContentToCanvas(canvas, id) {
  // traer de local storage sino dejarlo como estaba
  const canvasData = localStorage.getItem(`${id}-canvas`);
  if (canvasData) {
    let img = new Image();
    img.onload = function () {
      let context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
    };

    img.src = canvasData;
  } else {
    let context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export var draggedElement = null;
export var sourceContainer = null;

export function addEventsDragStartDragEnd(target) {
  target.addEventListener("dragstart", handleDragStart);
  target.addEventListener("dragend", handleDragEnd);
}

function handleDragStart(event) {
  draggedElement = event.target;
  sourceContainer = draggedElement.parentNode;
}

function handleDragEnd(event) {
  draggedElement = null;
  sourceContainer = null;
}

export function handleDropTask(event) {
  console.log("DROP");
  event.preventDefault();

  let { target } = event;

  if (!target) {
    return;
  }

  if (target.parentNode.getAttribute("id") !== "taskList") {
    target = target.parentNode;
  }

  if (target !== sourceContainer && draggedElement) {
    sourceContainer.removeChild(draggedElement);

    target.appendChild(draggedElement);

    draggedElement.updateState(target.getAttribute("state"));
  }
}

export function handleDragOverTask(event) {
  event.preventDefault();
}

export function handleDragLeaveTask(event) {
  console.log("DRAG LEAVE");
}
