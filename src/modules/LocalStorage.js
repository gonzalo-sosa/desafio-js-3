import { Storage } from "./storage";

export class LocalStorage extends Storage {
  static save(key, value) {
    localStorage.setItem(key, value);
  }
  static load(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key) || `${defaultValue}`);
  }

  static clear() {
    localStorage.clear();
  }
}
