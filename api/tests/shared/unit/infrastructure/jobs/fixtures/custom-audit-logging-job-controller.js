import { JobController, JobGroup } from '../../../../../../src/shared/application/jobs/job-controller.js';
import { AuditLoggingJob } from '../../../../../../src/shared/domain/models/jobs/AuditLoggingJob.js';

export class CustomAuditLoggingJobController extends JobController {
  constructor() {
    super(AuditLoggingJob.name, { jobGroup: JobGroup.DEFAULT });
  }

  get teamSize() {
    return 5;
  }

  get teamConcurrency() {
    return 2;
  }

  async handle() {}
}
