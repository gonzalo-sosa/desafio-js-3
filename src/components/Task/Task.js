export const TASK_STATES = {
  NEW: "Nueva",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
};

export class Task {
  constructor(title, description, expirationDate) {
    this.title = title;
    this.description = description;
    this.expirationDate = new Date(expirationDate);
    this._id = "UUID";
    this.state = TASK_STATES.NEW;
    this.createdAtDate = new Date();
  }
}
