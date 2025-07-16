import { auditLoggerRepository } from '../../../identity-access-management/infrastructure/repositories/audit-logger-repository.js';
import { EventLoggingJob } from '../../domain/models/jobs/EventLoggingJob.js';
import { JobController } from './job-controller.js';

export class EventLoggingJobController extends JobController {
  constructor() {
    super(EventLoggingJob.name);
  }

  async handle({ data: jobData, dependencies = { auditLoggerRepository } }) {
    const { client, action, role, userId, targetUserId, data, occurredAt } = jobData;

    return dependencies.auditLoggerRepository.logEvent({
      client,
      action,
      role,
      userId: userId.toString(),
      targetUserId: targetUserId.toString(),
      data,
      occurredAt,
    });
  }
}
