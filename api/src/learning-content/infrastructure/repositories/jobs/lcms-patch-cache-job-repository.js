import { JobRepository, JobRetry } from '../../../../shared/infrastructure/repositories/jobs/job-repository.js';
import { LcmsPatchCacheJob } from '../../../domain/models/LcmsPatchCacheJob.js';

class LcmsPatchCacheJobRepository extends JobRepository {
  constructor() {
    super({
      name: LcmsPatchCacheJob.name,
      retry: JobRetry.NO_RETRY,
    });
  }
}

export const lcmsPatchCacheJobRepository = new LcmsPatchCacheJobRepository();
