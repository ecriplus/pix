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

class CenterHabilitationError extends DomainError {
  constructor() {
    super('This certification center has no habilitation for the given complementary certification.');
    this.code = 'CENTER_HABILITATION_ERROR';
  }
}

export { CenterHabilitationError, CertificationComputeError, ChallengeAlreadyAnsweredError };
