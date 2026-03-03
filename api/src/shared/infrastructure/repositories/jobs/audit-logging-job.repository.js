import { AuditLoggingJob } from '../../../domain/models/jobs/AuditLoggingJob.js';
import { JobRepository, JobRetry } from './job-repository.js';

class AuditLoggingJobRepository extends JobRepository {
  constructor() {
    super({
      name: AuditLoggingJob.name,
      retry: JobRetry.STANDARD_RETRY,
    });
  }
}

export const auditLoggingJobRepository = new AuditLoggingJobRepository();
