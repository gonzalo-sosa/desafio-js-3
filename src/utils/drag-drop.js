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

function handleDragEnd() {
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
  console.log("DRAG LEAVE", event);
}
