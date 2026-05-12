import { JobRepository, JobRetry } from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ValidateGenericFileJob } from '../../../domain/models/jobs/ValidateGenericFileJob.js';

class ValidateGenericFileJobRepository extends JobRepository {
  constructor() {
    super({
      name: ValidateGenericFileJob.name,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const validateCommonOrganizationImportFileJobRepository = new ValidateGenericFileJobRepository();
