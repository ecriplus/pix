import { EventLoggingJob } from '../../../domain/models/jobs/EventLoggingJob.js';
import { JobRepository, JobRetry } from './job-repository.js';

class EventLoggingJobRepository extends JobRepository {
  constructor() {
    super({
      name: EventLoggingJob.name,
      retry: JobRetry.STANDARD_RETRY,
    });
  }
}

export const eventLoggingJobRepository = new EventLoggingJobRepository();
