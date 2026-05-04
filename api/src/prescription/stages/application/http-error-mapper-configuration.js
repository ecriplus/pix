import { HttpErrors } from '../../../shared/application/http-errors.js';
import { DomainErrorMappingConfiguration } from '../../../shared/application/models/domain-error-mapping-configuration.js';
import { StageModificationForbiddenForLinkedTargetProfileError } from '../domain/errors.js';

const stagesDomainErrorMappingConfiguration = [
  {
    name: StageModificationForbiddenForLinkedTargetProfileError.name,
    httpErrorFn: (error) => {
      return new HttpErrors.PreconditionFailedError(error.message);
    },
  },
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

export { stagesDomainErrorMappingConfiguration };
