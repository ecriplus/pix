import { JobRepository, JobRetry } from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ValidateSiecleFileJob } from '../../../domain/models/ValidateSiecleFileJob.js';

class ValidateSiecleFileJobRepository extends JobRepository {
  constructor() {
    super({
      name: ValidateSiecleFileJob.name,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const validateOrganizationImportFileJobRepository = new ValidateSiecleFileJobRepository();
