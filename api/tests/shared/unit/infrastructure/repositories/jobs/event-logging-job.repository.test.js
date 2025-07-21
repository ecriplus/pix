import { EventLoggingJob } from '../../../../../../src/shared/domain/models/jobs/EventLoggingJob.js';
import { eventLoggingJobRepository } from '../../../../../../src/shared/infrastructure/repositories/jobs/event-logging-job.repository.js';
import { JobRetry } from '../../../../../../src/shared/infrastructure/repositories/jobs/job-repository.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Shared | Infrastructure | Jobs | EventLoggingJobRepository', function () {
  it('sets up the job repository configuration', async function () {
    expect(eventLoggingJobRepository.name).to.equal(EventLoggingJob.name);
    expect(eventLoggingJobRepository.retry).to.equal(JobRetry.STANDARD_RETRY);
  });
});
