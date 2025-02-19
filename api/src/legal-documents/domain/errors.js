import { DomainError } from '../../shared/domain/errors.js';

class LegalDocumentInvalidDateError extends DomainError {
  constructor() {
    super(
      'Document version must not be before or equal to same document service and type',
      'LEGAL_DOCUMENT_INVALID_DATE',
    );
  }
}

export { LegalDocumentInvalidDateError };
