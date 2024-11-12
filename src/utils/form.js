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
