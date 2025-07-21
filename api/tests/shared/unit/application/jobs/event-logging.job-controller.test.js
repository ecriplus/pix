import { EventLoggingJobController } from '../../../../../src/shared/application/jobs/event-logging.job-controller.js';
import { EventLoggingJob } from '../../../../../src/shared/domain/models/jobs/EventLoggingJob.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Shared | Application | Jobs | EventLoggingJobController', function () {
  const now = new Date(2024, 1, 1);
  let clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });

  it('sets up the job controller configuration', async function () {
    const jobController = new EventLoggingJobController();
    expect(jobController.jobName).to.equal(EventLoggingJob.name);
  });

  it('logs the event', async function () {
    // given
    const auditLoggerRepository = { logEvents: sinon.stub() };
    const options = { dependencies: { auditLoggerRepository } };
    const data = {
      client: 'PIX_APP',
      action: 'EMAIL_CHANGED',
      role: 'USER',
      userId: 123,
      targetUserIds: [456, 789],
      data: { foo: 'bar' },
      occurredAt: now,
    };

    // when
    const jobController = new EventLoggingJobController();
    await jobController.handle({ data, ...options });

    // then
    expect(auditLoggerRepository.logEvents).to.have.been.calledWith([
      {
        client: data.client,
        action: data.action,
        role: data.role,
        userId: '123',
        targetUserId: '456',
        data: data.data,
        occurredAt: data.occurredAt,
      },
      {
        client: data.client,
        action: data.action,
        role: data.role,
        userId: '123',
        targetUserId: '789',
        data: data.data,
        occurredAt: data.occurredAt,
      },
    ]);
  });
});
