import { DomainError } from '../../../../shared/domain/errors.js';
import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';

export class ModuleMetadata {
  constructor({ id, slug, title, isBeta, duration }) {
    assertNotNullOrUndefined(id, 'The id is required for a module metadata');
    assertNotNullOrUndefined(slug, 'The slug is required for a module metadata');
    assertNotNullOrUndefined(title, 'The title is required for a module metadata');
    assertNotNullOrUndefined(isBeta, 'Field isBeta is required for a module metadata');
    assertNotNullOrUndefined(duration, 'The duration is required for a module metadata');
    this.#assertDurationHasPositiveValue(Number(duration));

    this.id = id;
    this.slug = slug;
    this.title = title;
    this.isBeta = isBeta;
    this.duration = Number(duration);
  }

  #assertDurationHasPositiveValue(duration) {
    if (duration <= 0) {
      throw new DomainError('The duration must be a positive integer for a module metadata');
    }
  }
}
