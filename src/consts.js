// Para evitar que se modifiquen las propiedades del objeto
export const STATES = Object.freeze({
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
});

// Para mostrar visualmente el nombre cada key
export const STATES_LABEL = {
  NEW: "Nueva",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
};

// Colores para cada estado
export const STATES_COLOR = {
  NEW: "#656F7D",
  IN_PROGRESS: "#40A6E6",
  COMPLETED: "#F9BE33",
};
