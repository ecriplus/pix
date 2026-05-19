import { HttpErrors } from '../../../shared/application/http-errors.js';
import { InvalidScoWhitelistError } from '../domain/errors.js';

export const configurationDomainErrorMappingConfiguration = [
  {
    name: InvalidScoWhitelistError.name,
    httpErrorFn: (error) => new HttpErrors.UnprocessableEntityError(error.message, error.code, error.meta),
  },
];
