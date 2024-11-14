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
export function createCopyButton(textContent, targetElement) {
  const $button = document.createElement('button');
  $button.type = 'button';
  $button.textContent = textContent;

  $button.addEventListener('click', () => {
    navigator.clipboard
      .writeText(targetElement.value)
      .then(() => console.log('Copiado al portapapeles'))
      .catch((err) => console.error('Error al copiar: ', err));
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
