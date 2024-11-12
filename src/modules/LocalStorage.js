import { Storage } from './storage';

export class LocalStorage extends Storage {
  /**
   * @param {string} key
   * @param {string} value
   * @returns {void}
   */
  static save(key, value) {
    localStorage.setItem(key, value);
  }
  /**
   * @param {string} key
   * @param {string} defaultValue
   */
  static load(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key) || defaultValue);
  }
}
