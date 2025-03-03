import { DomainError } from '../../../shared/domain/errors.js';

class ChallengeAlreadyAnsweredError extends DomainError {
  constructor() {
    super('La question a déjà été répondue.', 'ALREADY_ANSWERED_ERROR');
  }
}

export { ChallengeAlreadyAnsweredError };
