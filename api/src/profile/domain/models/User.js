import capitalize from 'lodash/capitalize.js';

export class User {
  id;
  #firstName;
  #lastName;

  constructor({ id, firstName, lastName }) {
    this.id = id;
    this.#firstName = firstName;
    this.#lastName = lastName;
  }

  get firstName() {
    return capitalize(this.#firstName.toLowerCase());
  }

  get lastName() {
    return this.#lastName.toUpperCase();
  }

  toForm(createdAt, locale, transformStringForFileName) {
    const map = new Map();

    const filename =
      transformStringForFileName(this.lastName) + '_' + transformStringForFileName(this.firstName) + '_' + Date.now();

    map.set('firstName', this.firstName);
    map.set('lastName', this.lastName);
    map.set('filename', filename);
    map.set('date', createdAt.toLocaleDateString(locale));

    return map;
  }
}
