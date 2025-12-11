import { tracked } from '@glimmer/tracking';

const DEFAULT_JOI_VALIDATE_OPTIONS = {
  abortEarly: false,
  allowUnknown: false,
};

/**
 * Validate form data according a given Joi schema and track validation errors
 */
export class FormValidator {
  @tracked errors = {};

  options = null;
  joiSchema = null;

  constructor(joiSchema, options = {}) {
    this.options = { ...DEFAULT_JOI_VALIDATE_OPTIONS, ...options };
    this.joiSchema = joiSchema;
  }

  /**
   * Validate data according the Joi Schema
   * @returns true if all data are valid
   */
  validate(data) {
    const { error } = this.joiSchema.validate(data, this.options);

    this.errors = {};
    if (error) {
      error.details.forEach((err) => {
        const fieldName = err.path[0];
        this.errors[fieldName] = err.message;
      });
    }
    return !error;
  }

  /**
   * Validate a single field defined in the Joi Schema
   * @returns true if the field value is valid
   */
  validateField(fieldName, value) {
    const fieldSchema = this.joiSchema.extract(fieldName);
    if (!fieldSchema) return;

    const { error } = fieldSchema.validate(value, this.options);

    if (error) {
      this.errors = { ...this.errors, [fieldName]: error.message };
    } else {
      this.errors = { ...this.errors, [fieldName]: undefined };
    }
    return !error;
  }

  /*
   * Reset the form validator to its initial state
   */
  reset() {
    this.errors = {};
  }
}
