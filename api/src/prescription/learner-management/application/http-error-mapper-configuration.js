import { HttpErrors } from '../../../shared/application/errors/http-errors.js';
import { AggregateImportError, CouldNotDeleteLearnersError, SiecleXmlImportError } from '../domain/errors.js';

const learnerManagementDomainErrorMappingConfiguration = [
  {
    name: AggregateImportError.name,
    httpErrorFn: (error) => new HttpErrors.PreconditionFailedError(error.message, error.code, error.meta),
  },
  {
    name: CouldNotDeleteLearnersError.name,
    httpErrorFn: (error) => new HttpErrors.PreconditionFailedError(error.message, error.code, error.meta),
  },
  {
    name: SiecleXmlImportError.name,
    httpErrorFn: (error) => new HttpErrors.PreconditionFailedError(error.message, error.code, error.meta),
  },
];

export { learnerManagementDomainErrorMappingConfiguration };
