import { RecordElement } from '../../components';
import { loadBlobFromLocalStorage, saveBlobToLocalStorage } from '../convert';

// Crear botón general
export function createButton({ id, type, text, classes, onClick }) {
  const button = document.createElement('button');
  button.id = id;
  button.type = type;
  button.textContent = text;
  button.classList.add(...classes);
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

// Campos de entrada de formulario
export function createInputField({ id, name, placeholder, type = 'text' }) {
  const $input = document.createElement('input');
  $input.type = type;
  $input.id = id;
  $input.name = name;
  $input.placeholder = placeholder;

  return $input;
}

// Botón para copiar texto
export function createCopyButton(classes, textContent, targetElement) {
  const $button = createButton({
    id: 'copy',
    type: 'button',
    classes,
    text: textContent,
    onClick: () => {
      navigator.clipboard
        .writeText(targetElement.value)
        .then(() => console.log('Copiado al portapapeles'))
        .catch((err) => console.error('Error al copiar: ', err));
    },
  });

  return $button;
}

// Crear un campo de fecha con botón de copiar
export function createDateField({ id, name }) {
  const $input = document.createElement('input');
  $input.type = 'date';
  $input.id = id;
  $input.name = name;

  return $input;
}

// Crear un textarea
export function createTextArea({ id, name, placeholder }) {
  const $textarea = document.createElement('textarea');
  $textarea.id = id;
  $textarea.name = name;
  $textarea.placeholder = placeholder;

  return $textarea;
}

export function createTitleField() {
  const $titleFieldContainer = document.createElement('div');
  const $titleInput = createInputField({
    id: 'title',
    name: 'title',
    placeholder: 'Título de la tarea',
  });
  const $titleCopyButton = createCopyButton(
    [
      'btn',
      'btn-copy',
      'text-xs',
      'py-1',
      'px-2',
      'rounded-md',
      'bg-blue-500',
      'text-white',
      'hover:bg-blue-600',
    ],
    'Copiar',
    $titleInput
  );

  // Estilos
  $titleFieldContainer.classList.add(
    'max-w-80%',
    'flex',
    'flex-row',
    'gap-1',
    'items-center'
  );
  $titleInput.classList.add(
    'flex',
    'h-10',
    'w-full',
    'max-w-[80%]',
    'rounded-md',
    'border',
    'border-input',
    'bg-background',
    'px-3',
    'py-2',
    'text-sm',
    'ring-offset-background',
    'file:border-0',
    'file:bg-transparent',
    'file:text-sm',
    'file:font-medium',
    'file:text-foreground',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50'
  );

  // Añadir al dom
  $titleFieldContainer.appendChild($titleInput);
  $titleFieldContainer.appendChild($titleCopyButton);

  return $titleFieldContainer;
}

export function createDescriptionField() {
  const $descriptionFieldContainer = document.createElement('div');
  const $descriptionTextarea = createTextArea({
    id: 'description',
    name: 'description',
    placeholder: 'Descripción de la tarea',
  });
  const $descriptionCopyButton = createCopyButton(
    [
      'btn',
      'btn-copy',
      'text-xs',
      'py-1',
      'px-2',
      'rounded-md',
      'bg-blue-500',
      'text-white',
      'hover:bg-blue-600',
    ],
    'Copiar',
    $descriptionTextarea
  );

  // Estilos
  $descriptionFieldContainer.classList.add(
    'flex',
    'flex-row',
    'gap-1',
    'items-center'
  );
  $descriptionTextarea.classList.add(
    'flex',
    'min-h-[80px]',
    'w-full',
    'max-w-[80%]',
    'rounded-md',
    'border',
    'border-input',
    'bg-background',
    'px-3',
    'py-2',
    'text-sm',
    'ring-offset-background',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50'
  );

  // Añadir al dom
  $descriptionFieldContainer.appendChild($descriptionTextarea);
  $descriptionFieldContainer.appendChild($descriptionCopyButton);

  return $descriptionFieldContainer;
}

export function createDueDateField() {
  const $dueDateFieldContainer = document.createElement('div');
  const $dueDateInput = createDateField({ id: 'due-date', name: 'due-date' });
  const $dueDateCopyButton = createCopyButton(
    [
      'btn',
      'btn-copy',
      'text-xs',
      'py-1',
      'px-2',
      'rounded-md',
      'bg-blue-500',
      'text-white',
      'hover:bg-blue-600',
    ],
    'Copiar',
    $dueDateInput
  );

  // Estilos
  $dueDateFieldContainer.classList.add(
    'flex',
    'flex-row',
    'items-center',
    'gap-1.5'
  );

  // Añadir al DOM
  $dueDateFieldContainer.appendChild($dueDateInput);
  $dueDateFieldContainer.appendChild($dueDateCopyButton);

  return $dueDateFieldContainer;
}

export function createAudioField() {
  const $audioContainer = document.createElement('div');
  const $record = new RecordElement(
    ({ id }) =>
      loadBlobFromLocalStorage(`${id}-audio`, 'application/octet-stream'),
    (data, { id }) => saveBlobToLocalStorage(data, `${id}-audio`)
  );

  // Estilos
  $audioContainer.classList.add('flex', 'flex-row', 'gap-1', 'items-center');

  // Añadir al DOM
  $audioContainer.appendChild($record);

  return $audioContainer;
}
