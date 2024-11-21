import { DomainError } from '../../../shared/domain/errors.js';

class ChallengeAlreadyAnsweredError extends DomainError {
  constructor(message) {
    super(message);
  }
}

export { ChallengeAlreadyAnsweredError };
