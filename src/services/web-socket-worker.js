let ws;
let messageQueue = [];

// Conectar WebSocket si no está conectado o si la conexión fue cerrada
function connectWebSocket() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return;
  }

  ws = new WebSocket(`ws://${process.env.SERVER_IP}:${process.env.PORT}`);

  // Configurar eventos WebSocket
  ws.onopen = () => {
    console.log("Conectado al servidor WebSocket");
    // Enviar todos los mensajes pendientes en la cola
    while (messageQueue.length > 0) {
      const pendingMessage = messageQueue.shift(); // Extraemos el primer mensaje de la cola
      sendWebSocketMessage(pendingMessage);
    }
  };

  ws.onerror = (error) => {
    console.error("Error en la conexión WebSocket:", error);
  };

  ws.onclose = (event) => {
    console.log("Conexión WebSocket cerrada", event);
    // Intentar reconectar automáticamente después de 1 segundo
    setTimeout(connectWebSocket, 1000);
  };

  ws.onmessage = (e) => {
    console.log("Mensaje recibido desde el servidor:", e);

    let data;
    try {
      data = JSON.parse(e.data);
    } catch (error) {
      console.error("Error al procesar los datos recibidos:", error);
      return;
    }

    // Procesar las tareas recibidas
    postMessage({ type: "NEW_TASK", task: data });
  };
}

function sendWebSocketMessage(message) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    console.log("Mensaje enviado:", message);
  } else {
    console.log("WebSocket no está listo, mensaje en cola:", message);
    messageQueue.push(message);
  }
}

onmessage = function (e) {
  const task = e.data;

  // Si no tenemos WebSocket, nos conectamos
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    connectWebSocket();
  }

  // Si se recibe una tarea, enviarla al servidor
  if (task) {
    sendWebSocketMessage(task);
    postMessage({ type: "TASK_SENT", task });
  } else {
    // Si no se recibe tarea, solicitar las tareas desde el servidor
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("Solicitando tareas al servidor...");
      ws.send(JSON.stringify({ action: "get_tasks" }));
    } else {
      console.log("WebSocket no está listo para recibir tareas.");
    }
  }
};
