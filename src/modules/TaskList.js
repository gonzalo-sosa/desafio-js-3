import { Task } from "./Task";

export class TaskList {
  constructor(tasks) {
    this._list = tasks ?? [];
  }

  addTask(task) {
    if (!(task instanceof Task)) throw new Error("No es tarea válida.");

    this._list.push(task);
  }

  removeTask(toRemove) {
    const index = this._list.findIndex((task) => task.id == toRemove.id);

    if (index === -1) throw new Error("Tarea inexistente.");

    this._list.splice(index, 1);
  }

  getTasks() {
    return this._list;
  }

  getTaskById(id) {
    return this._list.find((task) => task.id === id);
  }

  clear() {
    this._list = [];
  }

  toJSON() {
    return this._list.map((task) => task.toJSON());
  }

  toString() {
    return JSON.stringify(this._list);
  }
}
