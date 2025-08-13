import { assertIsArray, assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { ModuleInstantiationError } from '../../errors.js';

class Section {
  static AVAILABLE_TYPES = Object.freeze([
    'question-yourself',
    'explore-to-understand',
    'retain-the-essentials',
    'practise',
    'go-further',
    'blank',
  ]);

  constructor({ id, type, grains }) {
    assertNotNullOrUndefined(id, 'The id is required for a section');
    assertNotNullOrUndefined(type, 'The type is required for a section');
    this.#assertTypeIsValid(type);
    assertIsArray(grains, 'A list of grains is required for a section');

    this.id = id;
    this.type = type;
    this.grains = grains;
  }

  #assertTypeIsValid(type) {
    if (!Section.AVAILABLE_TYPES.includes(type)) {
      throw new ModuleInstantiationError(`The type must be one of ${Section.AVAILABLE_TYPES}`);
    }
  }
}

export { Section };
