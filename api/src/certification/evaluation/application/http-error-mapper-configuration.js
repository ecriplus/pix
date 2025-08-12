import { HttpErrors } from '../../../shared/application/http-errors.js';
import { DomainErrorMappingConfiguration } from '../../../shared/application/models/domain-error-mapping-configuration.js';
import { CenterHabilitationError } from '../domain/errors.js';

const evaluationDomainErrorMappingConfiguration = [
  {
    name: CenterHabilitationError.name,
    httpErrorFn: (error) => new HttpErrors.UnauthorizedError(error.message, error.code),
  },
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

export { evaluationDomainErrorMappingConfiguration };
