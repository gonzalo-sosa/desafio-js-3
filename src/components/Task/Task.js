import { STATES_LABEL } from "../consts";

export class Task {
  constructor(title, description, dueDate) {
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this._id = "UUID";
    this.state = STATES_LABEL.NEW;
    this.location = "location";
  }
}
