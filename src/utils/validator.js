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
