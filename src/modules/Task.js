import { STATES_LABEL } from "../consts";
import { createUUID } from "../utils/generator";
import { isString } from "../utils/validator";

export class Task {
  constructor(title, description, dueDate, state) {
    if (!title || !isString(title))
      throw new Error("Título es requerido y debe ser string.");
    if (!description || !isString(description))
      throw new Error("Título es requerido y debe ser string.");

    this._id = createUUID();
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this._state = state ?? STATES_LABEL.NEW;
    this.location = "location";
  }

  set state(newState) {
    if (this._state === newState) return;
    this._state = newState;
  }

  toJSON() {
    return {
      id: this._id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate.toISOString(),
      state: this.state,
      location: this.location,
    };
  }
}