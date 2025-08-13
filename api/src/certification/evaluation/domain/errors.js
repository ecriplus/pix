import { DomainError } from '../../../shared/domain/errors.js';

class ChallengeAlreadyAnsweredError extends DomainError {
  constructor() {
    super('La question a déjà été répondue.', 'ALREADY_ANSWERED_ERROR');
  }
}

class CertificationComputeError extends DomainError {
  constructor(message = 'Erreur lors du calcul de la certification.') {
    super(message);
  }
}

export { CertificationComputeError, ChallengeAlreadyAnsweredError };
