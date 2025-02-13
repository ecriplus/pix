import { Criterion } from './Criterion.js';
import { TYPES } from './Eligibility.js';
import { COMPARISON } from './Quest.js';

export const COMPOSE_TYPE = 'compose';

function getComparisonFunction(comparison) {
  return comparison === COMPARISON.ONE_OF ? 'some' : 'every';
}

class BaseRequirement {
  requirement_type;
  comparison;

  constructor({ requirement_type, comparison }) {
    this.requirement_type = requirement_type;
    this.comparison = comparison;
  }

  /**
   * @param {Eligibility|Success} _
   * @returns {Boolean}
   */
  isFulfilled(_) {
    throw new Error('implement me !');
  }

  /**
   * @returns {Object}
   */
  toDTO() {
    return {
      requirement_type: this.requirement_type,
      comparison: this.comparison,
    };
  }
}

export class ComposedRequirement extends BaseRequirement {
  #subRequirements = null;

  constructor({ data, comparison }) {
    super({ requirement_type: COMPOSE_TYPE, comparison });
    this.#subRequirements = data.map((subRequirement) => {
      if (subRequirement instanceof BaseRequirement) {
        return subRequirement;
      }
      return buildRequirement({
        requirement_type: subRequirement.requirement_type,
        data: subRequirement.data,
        comparison: subRequirement.comparison,
      });
    });
  }

  get data() {
    return Object.freeze(this.#subRequirements);
  }

  /**
   * @param {Eligibility|Success} dataInput
   * @returns {Boolean}
   */
  isFulfilled(dataInput) {
    const comparisonFunction = getComparisonFunction(this.comparison);
    return this.#subRequirements[comparisonFunction]((subRequirement) => subRequirement.isFulfilled(dataInput));
  }

  toDTO() {
    return {
      ...super.toDTO(),
      data: this.#subRequirements.map((subRequirement) => subRequirement.toDTO()),
    };
  }
}

export class ObjectRequirement extends BaseRequirement {
  #criterion;

  constructor({ requirement_type, data, comparison }) {
    super({ requirement_type, comparison });
    this.#criterion = data instanceof Criterion ? data : new Criterion({ data });
  }

  get data() {
    return Object.freeze(this.#criterion);
  }

  /**
   * @param {Eligibility|Success} dataInput
   * @returns {Boolean}
   */
  isFulfilled(dataInput) {
    const comparisonFunction = getComparisonFunction(this.comparison);

    if (Array.isArray(dataInput[this.requirement_type])) {
      return dataInput[this.requirement_type].some((item) => {
        return this.#criterion.check({ item, comparisonFunction });
      });
    }

    return this.#criterion.check({ item: dataInput[this.requirement_type], comparisonFunction });
  }

  toDTO() {
    return {
      ...super.toDTO(),
      data: this.#criterion.toDTO(),
    };
  }
}

/**
 * @param {Object} params
 * @param {string} params.requirement_type
 * @param {Object} params.data
 * @param {string} params.comparison
 * @returns {BaseRequirement}
 */
export function buildRequirement({ requirement_type, data, comparison }) {
  const objectTypes = Object.values(TYPES);
  if (requirement_type === COMPOSE_TYPE) {
    return new ComposedRequirement({ data, comparison });
  } else if (objectTypes.includes(requirement_type)) {
    return new ObjectRequirement({ requirement_type, data, comparison });
  }
  throw new Error(`Unknown requirement_type "${requirement_type}"`);
}
