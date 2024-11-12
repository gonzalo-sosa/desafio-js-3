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

## Implementación
