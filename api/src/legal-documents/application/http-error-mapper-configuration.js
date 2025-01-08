import { HttpErrors } from '../../shared/application/http-errors.js';
import { DomainErrorMappingConfiguration } from '../../shared/application/models/domain-error-mapping-configuration.js';
import { LegalDocumentInvalidDateError, LegalDocumentVersionNotFoundError } from '../domain/errors.js';

const legalDocumentsDomainErrorMappingConfiguration = [
  {
    name: LegalDocumentInvalidDateError.name,
    httpErrorFn: (error) => new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta),
  },
  {
    name: LegalDocumentVersionNotFoundError.name,
    httpErrorFn: (error) => new HttpErrors.NotFoundError(error.message, error.code, error.meta),
  },
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

export { legalDocumentsDomainErrorMappingConfiguration };
