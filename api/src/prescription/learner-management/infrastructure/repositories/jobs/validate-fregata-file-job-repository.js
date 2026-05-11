import { JobRepository, JobRetry } from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ValidateFregataFileJob } from '../../../domain/models/ValidateFregataFileJob.js';

class ValidateFregataFileJobRepository extends JobRepository {
  constructor() {
    super({
      name: ValidateFregataFileJob.name,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const validateFregataFileJobRepository = new ValidateFregataFileJobRepository();
