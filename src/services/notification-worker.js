// Crear notificación y enviarlas a todos los conectados al web socket
// Si no hay conectados enviarla a si mismo

onmessage = function (e) {
  const { title, dueDate } = e.data;

  new Notification('Lista de tareas', {
    body: `Nueva tarea ${title} con expiración el ${dueDate.toLocaleString()}`,
  });
};
