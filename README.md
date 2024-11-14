# Documentación

[Ver consignas](consignas.md)

## Proceso de desarrollo

### Planificación

Al comienzo cree las clases de tarea y lista de tareas para tener presente la lógica del proyecto y proyectar hacía el DOM en el momento que sea necesario.

Clase tarea con título, descripción, fecha de vencimiento, latitud y longitud (ubicación geográfica)

```js
class Task {
  constructor(title, description, dueDate, latitude, longitude) {
    this._id = createUUID();
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this._state = STATES.NEW; // constante con estados de una tarea
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
```

Clase lista de tareas que permite agregar y quitar tareas de un array.

```js
class TaskList {
  constructor(tasks) {
    this._list = tasks ?? [];
  }
}
```

Luego, investigué acerca de web components para integrarlos en el proyecto y otorgar una estructura más legible y forma modular a cada componente. El componente más importante es el componente "Task" o tarea.

El componente "TaskElement" extiende de "HTMLElement" una clase que trae consigo atributos y métodos propios de los elementos de un archivo html.

```js
class TaskElement extends HTMLElement {
  constructor(id, title, description, dueDate, location, state) {
    super(); // Constructor de la clase padre
  }
}
```

Esto permite que crear un elemento custom para agrupar la lógica del render en un único sector.

```html
<task-element></task-element>
```

Este task element tiene atributos que refieren a sus propiedades, el id, el título, la descripción y el estado.

```html
<task-element
  id="034523412asdf"
  title="Tarea 1"
  description="Descripción 1"
  state="NEW"
></task-element>
```

Estos atributos pueden ser observados dentro del elemento para ejecutar una función al momento del cambio.

```js
// Se observa el atributo 'state'
static get observedAttributes() {
  return ['state'];
}

attributeChangedCallback(name, oldValue, newValue) {
  if (name === 'state' && oldValue !== newValue) {
    this.state = newValue; // Asignar nuevo valor
    this.updateBtn(STATES_COLOR[newValue]); // Actualiza el color del botón si cambia el estado
    this.handleChangeState(); // llamar al método que cambia el estado de la tarea
  }
}
```

Agregar webpack y su configuración para crear un entorno de desarrollo en donde se vean reflejados los cambios. [Archivo de configuración de Webpack.](webpack.config.cjs)

## Configuración

### Webpack

Instalé webpack con el plugin que permite crear un servidor de desarrollo en un puerto del navegador "webpack-dev-server".

### Tailwind

Agregué tailwind para los estilos por lo que tuve que configurar su ejecución para agregarlo a webpack. Instalé plugin de tailwind para webpack y instalé tailwind con postcss.

### Gitignore

Utilice ".gitignore" para evitar que se suban al github archivos innecesarios como "node_modules/" o la carpeta "dist/". Además, evité subir archivos sensibles como ".env" para no exponer datos comprometedores.

### Eslint

Eslint analiza el código y emite advertencias y errores antes de que se ejecute el programa.

Instalé tanto la extensión de eslint para vscode como la dependencia de desarrollo y el plugin de webpack para buscar errores en mi código.

### Prettier

Anteriormente utilizaba prettier pero únicamente como extensión de vscode, pero con el avance del desarrollo integré la dependencia al proyecto para formatear el código en cada uno de los archivos y que estos sigan una armonía preestablecida.
Intenté agregar el plugin de prettier para webpack pero luego de unos pocos intentos decidí desinstalarlo ya que no me aportaba mejoras sustanciales.

## Funcionalidades

1. Gestión de tareas: agregué un formulario para que el usuario ingrese los datos título y descripción

2. Persistencia de datos:
   Se utiliza el localStorage, para esto cree una clase padre que servirá como interfaz llamada "Storage" que tiene métodos "save" y "load" que deben de ser implementados por las subclases.
   Entonces, creé una clase LocalStorage que utiliza la clase localStorage pero con un JSON parse dentro par simplificar el manejo de datos.

```js
export class Storage {
  static save() {
    throw new Error("Se debe de implementar el método 'save'");
  }

  static load() {
    throw new Error("Se debe de implementar el método 'save'");
  }
}
```

```js
import { Storage } from './storage';

export class LocalStorage extends Storage {
  /**
   * @param {string} key
   * @param {string} value
   * @returns {void}
   */
  static save(key, value) {
    localStorage.setItem(key, value);
  }
  /**
   * @param {string} key
   * @param {string} defaultValue
   */
  static load(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key) || defaultValue);
  }
}
```

3. Geolocalización:
   Creé un archivo donde se define una función asíncrona donde se obtiene la ubicación actual del usuario para asignar los datos de "latitude" y "longitude" a la tarea creada.

```js
// Función asíncrona que retorna una promesa
export async function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve([latitude, longitude]);
      },
      (error) => reject(error)
    );
  });
}
```

4. Dibujo en un lienzo:
   Para el canvas cree un elemento custom "CanvasElement" donde se declara un elemento canvas y funciones para manejar los eventos de dibujo.

```js
class CanvasElement extends HTMLElement {
  constructor(onClear, onSave) {
    super();
    // Funciones a ejecutar al limpiar y al guardar
    this.onClear = onClear;
    this.onSave = onSave;
    // Declaro propiedades con valores por defecto de la ubicación de mouse
    this.initialX = 0;
    this.initialY = 0;
    this.innerHTML = `<canvas></canvas>`;

    this.$canvas = this.querySelector('canvas');
    this.context = this.$canvas.getContext('2d');
  }
}
```

Funciones a ejecutar con los eventos escuchados.

```js
dibujar(dx, dy) {
  this.context.beginPath();
  this.context.moveTo(this.initialX, this.initialY);
  this.context.lineWidth = 5;
  this.context.strokeStyle = '#000';
  this.context.lineCap = 'round';
  this.context.lineJoin = 'round';
  this.context.lineTo(dx, dy);
  this.context.stroke();

  this.initialX = dx;
  this.initialY = dy;
}

mouseDown(event) {
  this.initialX = event.offsetX;
  this.initialY = event.offsetY;
  this.dibujar(this.initialX, this.initialY);

  this.$canvas.addEventListener('mousemove', (event) =>
    this.mouseMoving(event)
  );
}

mouseMoving(event) {
  this.dibujar(event.offsetX, event.offsetY);
}

mouseUp() {
  this.$canvas.removeEventListener('mousemove', () => this.mouseMoving());
}
```

5. Notificaciones:
   Las notificaciones se crean con el objeto "Notification" y se les asigna tanto el título como descripción de la notificación.

```js
const { title, dueDate } = task;

new Notification('Lista de tareas', {
  body: `Nueva tarea ${title} con expiración el ${dueDate.toLocaleString()}`,
});
```

6. Comunicación en tiempo real:
   Utilicé web sockets creando un servidor en un puerto aparte para que se conecten los usuarios, en este caso de un navegador a otro.

7. Promesas y async/await:
   Se utilizan en la función de geolocation.

8. Adicionales:

- Web Workers: utilicé los web workers para crear notificaciones y manejar la conexión al web socket

- Service Workers y PWA: no agregué esta funcionalidad debido a que la dejé a lo último ya que la consideré no fundamental.

- API de Media:
  Para agregar la funcionalidad de grabar notas de voz primero agregué elementos html como un botón para iniciar la grabación, otro botón para detener la grabación y un elemento audio que servirá como destino de la nota de grabación realizada.
  Cree un elemento custom llamado "RecordElement" que agrupa estos elementos html y agrega funcionalidades a eventos de click.

```js
class RecordElement extends HTMLElement {
  constructor(onLoad, onStop) {
    super();
    this.onLoad = onLoad;
    this.onStop = onStop;
    this.mediaRecorder; // Instancia de objeto MediaRecorder
    this.recordedChunks = []; // Datos grabados

    this.innerHTML = `<div><button id="startBtn" class="btn btn-record text-xs py-1 px-2 rounded-md bg-green-500 text-white hover:bg-green-600" type="button">Grabar</button><button id="stopBtn" class="btn btn-record text-xs py-1 px-2 rounded-md bg-red-500 text-white hover:bg-red-600" type="button">Detener</button><audio controls id="audioPlayback"></audio></div>`;

    this.$startBtn = this.querySelector('#startBtn');
    this.$stopBtn = this.querySelector('#stopBtn');
    this.$audioPlayback = this.querySelector('#audioPlayback');
  }
}
```

Luego, añadí los listener a eventos de click para que los botones funcionen.

```js
// Método para iniciar la grabación
async startRecording() {
  // Pido permisos para el uso de un micrófono
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Asignado a la propiedad una nueva instancia de MediaRecorder con el stream
  this.mediaRecorder = new MediaRecorder(stream);

  // Una vez que los datos están disponibles, almaceno en la propiedad los datos obtenidos por el micrófono.
  this.mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      this.recordedChunks.push(event.data);
    }
  };

  // Si se detiene la grabación, entonces almaceno los datos en formato Blob
  // Creo una URL a partir del Blob generado anteriormente
  // Añado la URL al src de elemento audio
  // Y ejecuto la función onStop si el custom element tiene ID
  this.mediaRecorder.onstop = () => {
    const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
    const audioURL = URL.createObjectURL(blob);
    this.$audioPlayback.src = audioURL;
    this.recordedChunks = [];
    if (this.hasAttribute('task-id')) {
      this.onStop(blob, { id: this.getAttribute('task-id') });
    }
  };

  // Inicio grabación y actualizo el estado de los botones.
  this.mediaRecorder.start();
  this.$startBtn.disabled = true;
  this.$stopBtn.disabled = false;
}

// Una vez terminada la grabación devuelvo los botones a su estado original
stopRecording() {
  this.mediaRecorder.stop();
  this.$startBtn.disabled = false;
  this.$stopBtn.disabled = true;
}

// Una vez creado el custom element añado las funciones al evento click de cada botón
connectedCallback() {
  this.$startBtn.addEventListener('click', () => this.startRecording());
  this.$stopBtn.addEventListener('click', () => this.stopRecording());
}

```

- API de Drag and Drop: primeramente para que un elemento sea "draggable" hay que agregarle este atributo al elemento.

```html
<task-element draggable="true"></task-element>
```

Luego se deben de tener en cuenta funciones para manejar eventos de dragstart,dragend y drop.

```js
var draggedElement = null;
var sourceContainer = null;

// la función añade los eventos al elemento target (que sería una tarea)
export function addEventsDragStartDragEnd(target) {
  target.addEventListener('dragstart', handleDragStart);
  target.addEventListener('dragend', handleDragEnd);
}

// Asigno el valor del elemento que inició el drag a la variable global draggedElement
// Y, asigno la variable sourceContainer al elemento padre del draggedElement
function handleDragStart(event) {
  draggedElement = event.target;
  sourceContainer = draggedElement.parentNode;
}

// Una vez que finalizó el drag entonces limpio el valor de las variables globales
function handleDragEnd() {
  draggedElement = null;
  sourceContainer = null;
}
```

Por último, se debe se agregar un listener al evento drop de cada una de los elementos listas para que cuando se suelte una tarea sobre estos se ejecute la función "handleDropTask".

```js
$taskListNew.addEventListener('drop', handleDropTask);
$taskListInProgress.addEventListener('drop', handleDropTask);
$taskListCompleted.addEventListener('drop', handleDropTask);
```

Dentro de la función se verifica que exista un elemento y que si este cambia el contenedor entonces si se puede realizar el drop, esto para evitar que se realice un drag y drop dentro del mismo contenedor.
Una vez verificado, se quita a la tarea del contenedor original y se lo agrega al nuevo contenedor que sería el actual.

```js
export function handleDropTask(event) {
  event.preventDefault();

  let { target } = event;

  if (!target) {
    return;
  }

  if (target.parentNode.getAttribute('id') !== 'taskList') {
    target = target.parentNode;
  }

  if (target !== sourceContainer && draggedElement) {
    sourceContainer.removeChild(draggedElement);

    target.appendChild(draggedElement);

    draggedElement.updateState(target.getAttribute('state'));
  }
}
```

- API de Clipboard: al hacer click en botón "copiar" de título, descripción o fecha se copiará el contenido de la tarea al clipboard del usuario.

```js
// Como es una función asíncrona imprimo por consola si el copiado fue exitoso o si hubo algún error
$titleCopyButton.addEventListener('click', () => {
  navigator.clipboard
    .writeText($titleInput.value)
    .then(() => {
      console.log('Título copiado al portapapeles');
    })
    .catch((err) => {
      console.error('Error al copiar al portapapeles: ', err);
    });
});
```
