import omit from 'lodash/omit.js';

export class OrganizationImportDetail {
  #errors;
  constructor({ id, status, errors, createdAt, updatedAt, firstName, lastName }) {
    this.id = id;
    this.status = status;
    this.#errors = errors;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.createdBy = {
      firstName,
      lastName,
    };
  }
  get hasFixableErrors() {
    return this.#errors?.some((error) => error.code || error.name === 'AggregateImportError') === true;
  }

  get errors() {
    return this.#errors?.map((error) => omit(error, 'stack')) ?? null;
  }
}
