import { Criterion } from './Criterion.js';
import { TYPES } from './Eligibility.js';
import { COMPARISON } from './Quest.js';

export const COMPOSE_TYPE = 'compose';
export const SKILL_PROFILE_TYPE = 'skillProfile';

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

  /**
   * @returns {Object}
   */
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

export class SkillProfileRequirement extends BaseRequirement {
  #skillIds;
  #threshold;

  constructor({ data }) {
    super({ requirement_type: SKILL_PROFILE_TYPE, comparison: null });
    this.#skillIds = data.skillIds;
    this.#threshold = data.threshold;
  }

  /**
   * @returns {Object}
   */
  get data() {
    return {
      skillIds: Object.freeze(this.#skillIds),
      threshold: this.#threshold,
    };
  }

  /**
   * @param {Eligibility|Success} dataInput
   * @returns {Boolean}
   */
  isFulfilled(dataInput) {
    const masteryPercentage = dataInput.getMasteryPercentageForSkills(this.#skillIds);
    return masteryPercentage >= this.#threshold;
    // la comparaison ici pourrait être celle du requirement ? pour pouvoir avoir de la flexi sur =<>=
  }

  /**
   * @returns {Object}
   */
  toDTO() {
    const superDto = super.toDTO();
    delete superDto.comparison;
    return {
      ...superDto,
      data: this.data,
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
  } else if (requirement_type === SKILL_PROFILE_TYPE) {
    return new SkillProfileRequirement({ data });
  }
  throw new Error(`Unknown requirement_type "${requirement_type}"`);
}
