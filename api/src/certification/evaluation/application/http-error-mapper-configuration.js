import { HttpErrors } from '../../../shared/application/errors/http-errors.js';
import { NextChallengeAlreadyComputingError } from '../domain/errors.js';

const evaluationDomainErrorMappingConfiguration = [
  {
    name: NextChallengeAlreadyComputingError.name,
    httpErrorFn: (error) => new HttpErrors.LockedError(error.message),
  },
];
export { evaluationDomainErrorMappingConfiguration };
