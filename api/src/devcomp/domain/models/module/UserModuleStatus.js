import { DomainError } from '../../../../shared/domain/errors.js';
import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';

const StatusesEnumValues = Object.freeze({
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
});

class UserModuleStatus {
  constructor({ userId, moduleId, passages }) {
    assertNotNullOrUndefined(userId, 'The userId is required for a UserModuleStatus');
    assertNotNullOrUndefined(moduleId, 'The moduleId is required for a UserModuleStatus');
    assertNotNullOrUndefined(passages, 'The passages field is required for a UserModuleStatus');

    this.moduleId = moduleId;
    this.userId = userId;

    this.#assertAllPassageHaveTheSameUserAndModuleId(passages);
    this.passages = passages;
    this.status = this.computeStatus();
  }

  computeStatus() {
    if (this.passages.length === 0) {
      return StatusesEnumValues.NOT_STARTED;
    }

    const mostRecentPassage = this.#findMostRecentPassage(this.passages);

    if (!mostRecentPassage.terminatedAt) {
      return StatusesEnumValues.IN_PROGRESS;
    } else {
      return StatusesEnumValues.COMPLETED;
    }
  }

  #assertAllPassageHaveTheSameUserAndModuleId(passages) {
    const assertion = passages.every((passage) => passage.moduleId === this.moduleId && passage.userId === this.userId);

    if (!assertion) {
      throw new DomainError('Module and user id of passages must be the same as UserModuleStatus attributes');
    }
  }

  #findMostRecentPassage(passages) {
    const sortedPassages = passages.sort((p1, p2) => {
      return p2.updatedAt.getTime() - p1.updatedAt.getTime();
    });
    return sortedPassages[0];
  }
}

export { UserModuleStatus };
