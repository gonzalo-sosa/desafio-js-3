import { TaskElement } from "../components";

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

  return LMap;
}

function createMap(container, latitude = -34.61315, longitude = -58.67723) {
  // TODO: realizar resize al renderizar por primera vez

  const lMap = L.map(container, {
    minZoom: 10,
  }).setView([latitude, longitude], 10);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(lMap);

  return lMap;
}

export function addContentToCanvas(canvas) {
  const $drawingAreaContainer = document.createElement("div");
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

  const $drawingAreaText = document.createElement("span");
  $drawingAreaText.classList.add("ml-2");
  $drawingAreaText.textContent = "Área de dibujo";

  $drawingAreaContainer.appendChild($drawingAreaText);

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

  return $taskElement;
}

export function changeTabManagerContent(event, details, map, canvas) {
  const $taskElement = event.target;

  const $tabManager = document.querySelector("tab-manager");
  const $details = $tabManager.querySelector("[tab-content-name=details]");
  //const $canvas = $tabManager.querySelector("[tab-content-name=canvas]");

  editContentToDetails($details, $taskElement);
  editViewToMap(map, $taskElement);
  //editContentToCanvas($canvas);
}

function editContentToDetails($details, task) {
  const $title = $details.querySelector("[name=title]");
  const $description = $details.querySelector("[name=description");
  const $dueDate = $details.querySelector("[name=due-date]");

  $title.setAttribute("value", task.title);
  $description.value = task.description ?? "";
  $dueDate.setAttribute("value", task.dueDate.toISOString().split("T")[0]);
}

function editViewToMap(map, $taskElement) {
  map.setView($taskElement.location, 15);
}
