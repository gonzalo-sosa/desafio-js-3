import { STATES_LABEL } from "../consts";

export class Task {
  constructor(title, description, expirationDate) {
    this.title = title;
    this.description = description;
    this.expirationDate = new Date(expirationDate);
    this._id = "UUID";
    this.state = STATES_LABEL.NEW;
    this.createdAtDate = new Date();
  }
}
