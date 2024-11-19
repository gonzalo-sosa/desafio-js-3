import { ValidatorDate, ValidatorString } from './validator';

export function getFormData(event) {
  const $addTaskForm = event.target;

  const data = new FormData($addTaskForm);

  const title = data.get('title');
  const description = data.get('description');
  const dueDate = data.get('due-date');

  if (ValidatorString.isEmpty(title, description, dueDate))
    throw new Error('Los valores son requeridos.');

  if (
    !ValidatorString.isAlphanumeric(title) ||
    ValidatorString.isValueLong(title.length)
  )
    throw new Error('El título no es válido');

  console.log(description, description.length);
  if (
    !ValidatorString.isAlphanumeric(description) ||
    ValidatorString.isValueLong(description.length)
  )
    throw new Error('La descripción no es válida.');

  if (ValidatorDate.isPastDate(dueDate))
    throw new Error('La fecha no puede ser anterior a la actual.');

  return {
    title,
    description,
    dueDate,
  };
}
