import { HttpErrors } from '../../shared/application/http-errors.js';
import { DomainErrorMappingConfiguration } from '../../shared/application/models/domain-error-mapping-configuration.js';
import { LegalDocumentInvalidDateError } from '../domain/errors.js';

const legalDocumentsDomainErrorMappingConfiguration = [
  {
    name: LegalDocumentInvalidDateError.name,
    httpErrorFn: (error) => new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta),
  },
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

export { legalDocumentsDomainErrorMappingConfiguration };
