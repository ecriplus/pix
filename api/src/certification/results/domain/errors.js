import { DomainError } from '../../../shared/domain/errors.js';

class MoreThanOneMatchingCertificationError extends DomainError {
  constructor(message = 'More than one candidate found for current search parameters') {
    super(message);
  }
}

class NoCertificationResultForDivision extends DomainError {
  constructor(message = 'Aucun résultat de certification pour cette classe.') {
    super(message);
  }
}

class CertificateGenerationError extends DomainError {
  constructor(message = 'An error has occurred during PDF generation') {
    super(message);
  }
}

export { CertificateGenerationError, MoreThanOneMatchingCertificationError, NoCertificationResultForDivision };
