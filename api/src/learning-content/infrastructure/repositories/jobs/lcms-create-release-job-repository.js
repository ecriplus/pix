import { JobRepository, JobRetry } from '../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { LcmsCreateReleaseJob } from '../../../domain/models/LcmsCreateReleaseJob.js';

class LcmsCreateReleaseJobRepository extends JobRepository {
  constructor() {
    super({
      name: LcmsCreateReleaseJob.name,
      retry: JobRetry.NO_RETRY,
    });
  }
}

export const lcmsCreateReleaseJobRepository = new LcmsCreateReleaseJobRepository();
