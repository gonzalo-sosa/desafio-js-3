# Documentación

[Ver consignas](consignas.md)

## Proceso de desarrollo

## Planificación

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

Agregar webpack y su configuración para crear un entorno de desarrollo en donde se vean reflejados los cambios. [Archivo de configuración de Webpack.](webpack.config.cjs)

Luego, investigué acerca de web components para integrarlos en el proyecto y otorgar una estructura más legible y forma modular a cada componente. El componente más importante es el componente "Task" o tarea.

El componente "TaskElement" extiende de "HTMLElement" una clase que trae consigo atributos y métodos propios de los elementos de un archivo html.

```js
class TaskElement extends HTMLElement {
  constructor() {
    super();
  }
}
```

## Implementación
