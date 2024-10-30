# Aplicación Web de Gestión de Eventos y Tareas con Funcionalidades Avanzadas

## Descripción General

El objetivo de este ejercicio es desarrollar una aplicación web interactiva que gestione eventos y tareas, integrando una variedad de APIs de JavaScript disponibles en navegadores modernos. La aplicación permitirá a los usuarios agregar y gestionar tareas, visualizar su ubicación, interactuar con un lienzo de dibujo, y recibir notificaciones. También se implementarán características avanzadas como el uso de WebSockets para la comunicación en tiempo real, y Service Workers para habilitar la funcionalidad offline.

## Funcionalidades Principales

1. Gestión de Tareas:

- Los usuarios podrán agregar nuevas tareas, marcarlas como completadas y eliminarlas.
- Cada tarea podrá tener una descripción, una fecha de vencimiento, y una ubicación geográfica que se obtendrá mediante la API de Geolocalización.

2. Persistencia de Datos:

- Utilizar localStorage para almacenar las tareas de manera que persistan entre recargas de la página.
- Implementar la lógica necesaria para cargar las tareas almacenadas al inicio de la aplicación.

3. Geolocalización:

- Utilizar la API de Geolocalización para obtener la ubicación actual del usuario y asociarla con cada tarea.
- Mostrar la ubicación en un mapa (se puede usar una biblioteca de mapas como Leaflet o Google Maps).

4. Dibujo en un Lienzo:

- Implementar un área de dibujo utilizando la API de Canvas donde los usuarios podrán dibujar algo relacionado con las tareas.
- Incluir opciones para limpiar el lienzo y guardar el dibujo en localStorage.

5. Notificaciones:

- Usar la API de Notificaciones para enviar alertas a los usuarios cuando se agreguen nuevas tareas.
- Solicitar permiso al usuario para mostrar notificaciones al cargar la aplicación.

6. Comunicación en Tiempo Real:

- Implementar una conexión WebSocket que permita a los usuarios recibir actualizaciones de tareas en tiempo real desde un servidor (puede ser un servidor simulado para este ejercicio).

7. Uso de Promesas y async/await:

- Gestionar las llamadas a APIs externas (como la de geolocalización o cualquier API adicional) utilizando async/await para manejar la asincronía y las promesas.

8. Funcionalidades Adicionales:

- Web Workers: Utilizar Web Workers para realizar cálculos pesados relacionados con las tareas (por ejemplo, establecer recordatorios basados en fechas).
- Service Workers y PWA: Implementar un Service Worker para habilitar el modo offline, permitiendo a los usuarios continuar usando la aplicación sin conexión a Internet.
- API de Media: Permitir a los usuarios grabar notas de voz asociadas a tareas mediante la API de Media.
- API de Drag and Drop: Permitir a los usuarios reorganizar las tareas en la lista mediante arrastrar y soltar.
- API de Clipboard: Proporcionar una opción para copiar la descripción de las tareas al portapapeles.

## Especificaciones Técnicas del Proyecto

1. Estructura del Proyecto:

- Organizar el proyecto en carpetas para los componentes, estilos, scripts y cualquier recurso adicional.
- Usar un bundler (como Webpack) para agrupar y optimizar los archivos JavaScript y CSS.

2. Interfaz de Usuario:

- Diseñar una interfaz atractiva y responsive que funcione bien en dispositivos móviles y de escritorio.
- Incluir un formulario para agregar tareas con campos para la descripción, la fecha de vencimiento y la ubicación.
- Mostrar las tareas en una lista interactiva con opciones para completarlas, eliminarlas y reorganizarlas.

3. Documentación y Código Limpio:

- Mantener un código limpio y bien comentado, siguiendo las mejores prácticas de la industria.
- Incluir un README en el repositorio con instrucciones sobre cómo ejecutar la aplicación, así como una descripción del proceso de desarrollo.

## Entrega

1. Repositorio:

- Sube tu proyecto a una plataforma como GitHub. Asegúrate de que el repositorio contenga todos los archivos necesarios para ejecutar la aplicación.

2. Demostración:

- Prepara una presentación breve (puede ser en video o en vivo) donde expliques el desarrollo del proyecto. Debes incluir:
- Cómo se estructuró el proyecto y por qué.
- Las decisiones de diseño y la lógica detrás de la implementación de cada funcionalidad.
- Cómo se implementaron las integraciones con las diferentes APIs.

3. Documentación:

- Incluye un README detallado que cubra:
- El proceso de desarrollo, desde la planificación hasta la implementación.
- Las decisiones tomadas durante la implementación y los desafíos enfrentados.
- Instrucciones sobre cómo ejecutar la aplicación localmente, así como ejemplos de cómo usar las diferentes características.

## Criterios de Evaluación

- Funcionalidad Completa: La aplicación cumple con todas las especificaciones y funciona como se esperaba.
- Uso Efectivo de APIs: Se utilizan adecuadamente todas las APIs mencionadas, y se implementan correctamente en el proyecto.
- Calidad del Código: El código es limpio, legible, y sigue las mejores prácticas de desarrollo.

- Documentación Clara: El README proporciona información útil y clara sobre el proyecto, incluyendo instrucciones y detalles sobre el proceso.
- Presentación Efectiva: La demostración muestra de manera efectiva el desarrollo del proyecto y su funcionamiento.

## Recursos Adicionales

- [MDN sobre la API de Geolocalización](https://developer.mozilla.org/es/docs/Web/API/Geolocation_API)
- [MDN sobre la API de Canvas](https://developer.mozilla.org/es/docs/Web/API/Canvas_API)
- [MDN sobre WebSockets](https://developer.mozilla.org/es/docs/Web/API/WebSockets_API)
- [MDN sobre Web Workers](https://developer.mozilla.org/es/docs/Web/API/Web_Workers_API)
- [MDN sobre la API de Notificaciones](https://developer.mozilla.org/es/docs/Web/API/Notifications_API)
- [MDN sobre Service Workers](https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API)
- [MDN sobre la API de Media](https://developer.mozilla.org/es/docs/Web/API/Media_Capture_and_Streams_API)
- [MDN sobre la API de Drag and Drop](https://developer.mozilla.org/es/docs/Web/API/HTML_Drag_and_Drop_API)
- [MDN sobre la API de Clipboard](https://developer.mozilla.org/es/docs/Web/API/Clipboard_API)
- [MDN sobre el DOM](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model)
