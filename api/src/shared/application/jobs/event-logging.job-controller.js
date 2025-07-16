import { EventLoggingJob } from '../../domain/models/jobs/EventLoggingJob.js';
import { auditLoggerRepository } from '../../infrastructure/repositories/audit-logger-repository.js';
import { JobController } from './job-controller.js';

export class EventLoggingJobController extends JobController {
  constructor() {
    super(EventLoggingJob.name);
  }

  async handle({ data: jobData, dependencies = { auditLoggerRepository } }) {
    const { client, action, role, userId, targetUserIds, data, occurredAt } = jobData;

    const auditLoggerEvents = targetUserIds.map((targetUserId) => {
      return {
        client,
        action,
        role,
        userId: userId.toString(),
        targetUserId: targetUserId.toString(),
        data,
        occurredAt,
      };
    });

    return dependencies.auditLoggerRepository.logEvents(auditLoggerEvents);
  }
}
