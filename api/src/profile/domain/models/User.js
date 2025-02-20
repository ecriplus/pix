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

  toForm(createdAt, locale) {
    const map = new Map();

    map.set('firstName', this.firstName);
    map.set('lastName', this.lastName);
    map.set('filename', this.firstName + '_' + this.lastName + '_' + Date.now());
    map.set('date', createdAt.toLocaleDateString(locale));

    return map;
  }
}
