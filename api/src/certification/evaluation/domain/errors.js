import { DomainError } from '../../../shared/domain/errors.js';

class CertificationComputeError extends DomainError {
  constructor(message = 'Erreur lors du calcul de la certification.') {
    super(message);
  }
}

export { CertificationComputeError };
