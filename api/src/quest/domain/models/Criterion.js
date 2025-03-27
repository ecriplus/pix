import Joi from 'joi';

import { CriterionProperty } from './CriterionProperty.js';

const schema = Joi.object({ data: Joi.object().pattern(Joi.string(), Joi.object()).required() });

export class Criterion {
  #properties;

  constructor(args) {
    this.#validate(args);

    const { data } = args;

    this.#properties = Object.keys(data).map((key) => {
      const property = data[key];
      return new CriterionProperty({
        key,
        data: property.data,
        comparison: property.comparison,
      });
    });
  }

  #validate(args) {
    schema.validate(args);
  }

  get data() {
    return this.#properties.reduce((acc, next) => {
      acc[next.key] = {
        data: next.data,
        comparison: next.comparison,
      };
      return acc;
    }, {});
  }

  toDTO() {
    return this.data;
  }

  check({ item, comparisonFunction }) {
    return this.#properties[comparisonFunction]((property) => {
      return property.check(item);
    });
  }
}
