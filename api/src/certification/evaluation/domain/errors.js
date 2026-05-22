import { DomainError } from '../../../shared/domain/errors.js';

class CertificationComputeError extends DomainError {
  constructor(message = 'Erreur lors du calcul de la certification.') {
    super(message);
  }
}

class NextChallengeAlreadyComputingError extends DomainError {
  constructor() {
    super('Une nouvelle épreuve est en cours de calcul');
  }
}

export { CertificationComputeError, NextChallengeAlreadyComputingError };
