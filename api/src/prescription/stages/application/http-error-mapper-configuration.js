import { HttpErrors } from '../../../shared/application/http-errors.js';
import { StageModificationForbiddenForLinkedTargetProfileError } from '../domain/errors.js';

const stagesDomainErrorMappingConfiguration = [
  {
    name: StageModificationForbiddenForLinkedTargetProfileError.name,
    httpErrorFn: (error) => {
      return new HttpErrors.PreconditionFailedError(error.message);
    },
  },
];

export { stagesDomainErrorMappingConfiguration };
