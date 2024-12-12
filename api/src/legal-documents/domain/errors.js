import { DomainError } from '../../shared/domain/errors.js';

class LegalDocumentInvalidDateError extends DomainError {
  constructor({
    code = 'LEGAL_DOCUMENT_INVALID_DATE',
    message = 'Document version must not be before or equal to same document type and service',
  } = {}) {
    super(message);
    this.code = code;
  }
}

export { LegalDocumentInvalidDateError };
