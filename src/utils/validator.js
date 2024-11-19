/* eslint-disable no-prototype-builtins */
import { STATES } from '../consts';

export class ValidatorString {
  static isString(str) {
    return typeof str === 'string';
  }

  static isEmpty(...values) {
    const regex = /^(?!\s*$).+/;
    values.forEach((value) => {
      if (!regex.test(value)) return true;
    });
    return false;
  }

  static isAlphanumeric(value) {
    const regex = /^(?!\s*$)[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(value);
  }

  static isValueLong(value, maxLength = 100) {
    return value > maxLength;
  }
}

export class ValidatorDate {
  static isPastDate(value) {
    const inputDate = new Date(value);
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    return inputDate < currentDate;
  }
}

export class ValidatorTask {
  static isTasK(data) {
    if ((!data) instanceof Object) return false;

    // Valida existencia de propiedades
    if (
      typeof data !== 'object' ||
      !data.hasOwnProperty('id') ||
      !data.hasOwnProperty('title') ||
      !data.hasOwnProperty('description') ||
      !data.hasOwnProperty('dueDate') ||
      !data.hasOwnProperty('state') ||
      !data.hasOwnProperty('latitude') ||
      !data.hasOwnProperty('longitude')
    ) {
      return false;
    }

    // Valida los tipos de las propiedades
    if (
      typeof data.id !== 'string' ||
      typeof data.title !== 'string' ||
      typeof data.description !== 'string' ||
      typeof data.dueDate !== 'string' ||
      !Object.values(STATES).includes(data.state) || // Verifica que el estado sea uno de los definidos en STATES
      typeof data.latitude !== 'number' ||
      typeof data.longitude !== 'number'
    ) {
      return false;
    }

    return true;
  }
}
