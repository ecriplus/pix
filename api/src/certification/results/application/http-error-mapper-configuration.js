import { HttpErrors } from '../../../shared/application/http-errors.js';
import { MoreThanOneMatchingCertificationError, NoCertificationResultForDivision } from '../domain/errors.js';

const parcoursupDomainErrorMappingConfiguration = [
  {
    name: MoreThanOneMatchingCertificationError.name,
    httpErrorFn: (error) => new HttpErrors.ConflictError(error.message),
  },
];

const resultsDomainErrorMappingConfiguration = [
  {
    name: NoCertificationResultForDivision.name,
    httpErrorFn: (error) => new HttpErrors.NotFoundError(error.message, error.code, error.meta),
  },
];

export { parcoursupDomainErrorMappingConfiguration, resultsDomainErrorMappingConfiguration };
