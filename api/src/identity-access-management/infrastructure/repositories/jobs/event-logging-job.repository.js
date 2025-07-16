import { EventLoggingJob } from '../../../../shared/domain/models/jobs/EventLoggingJob.js';
import { JobRepository, JobRetry } from '../../../../shared/infrastructure/repositories/jobs/job-repository.js';

class EventLoggingJobRepository extends JobRepository {
  constructor() {
    super({
      name: EventLoggingJob.name,
      retry: JobRetry.STANDARD_RETRY,
    });
  }
}

export const eventLoggingJobRepository = new EventLoggingJobRepository();
