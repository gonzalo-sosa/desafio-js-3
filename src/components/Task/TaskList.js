export class TaskList {
  constructor(tasks) {
    this.list = tasks ?? [];
  }

  addTask(task) {
    this.list.push(task);
  }

  removeTask(toRemove) {
    const index = this.list.indexOf((task) => task._id == toRemove._id);

    if (index === -1) throw new Error("Tarea inexistente.");

    this.list.splice(index, 1);
  }

  toString() {
    return JSON.stringify(this.list);
  }
}
