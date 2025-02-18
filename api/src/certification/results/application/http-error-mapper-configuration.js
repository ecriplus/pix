import { HttpErrors } from '../../../shared/application/http-errors.js';
import { DomainErrorMappingConfiguration } from '../../../shared/application/models/domain-error-mapping-configuration.js';
import { MoreThanOneMatchingCertificationError, NoCertificationResultForDivision } from '../domain/errors.js';

const parcoursupDomainErrorMappingConfiguration = [
  {
    name: MoreThanOneMatchingCertificationError.name,
    httpErrorFn: (error) => new HttpErrors.ConflictError(error.message),
  },
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

const resultsDomainErrorMappingConfiguration = [
  {
    name: NoCertificationResultForDivision.name,
    httpErrorFn: (error) => new HttpErrors.NotFoundError(error.message, error.code, error.meta),
  },
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

export { parcoursupDomainErrorMappingConfiguration, resultsDomainErrorMappingConfiguration };
