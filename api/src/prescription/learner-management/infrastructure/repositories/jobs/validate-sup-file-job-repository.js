import { JobRepository, JobRetry } from '../../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { ValidateSupFileJob } from '../../../domain/models/ValidateSupFileJob.js';

class ValidateSupFileJobRepository extends JobRepository {
  constructor() {
    super({
      name: ValidateSupFileJob.name,
      retry: JobRetry.FEW_RETRY,
    });
  }
}

export const validateSupFileJobRepository = new ValidateSupFileJobRepository();
