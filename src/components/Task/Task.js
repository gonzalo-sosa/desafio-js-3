import { STATES_LABEL } from "../consts";

export class Task {
  constructor(title, description, dueDate, state) {
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.state = state ?? STATES_LABEL.NEW;
    this._id = "UUID";
    this.location = "location";
  }
}
