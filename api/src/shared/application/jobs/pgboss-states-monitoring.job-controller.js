import { config } from '../../config.js';
import { JobClient } from '../../infrastructure/jobs/JobClient.js';
import { logger } from '../../infrastructure/utils/logger.js';
import { JobScheduleController } from './job-schedule-controller.js';

export class PgBossStatesMonitoringJobController extends JobScheduleController {
  constructor() {
    super('PgBossStatesMonitoring', { jobCron: config.pgBoss.statesMonitoringJobCron });
  }

  async handle({ dependencies = { logger } }) {
    const stats = await JobClient.instance.getQueuesStats();

    Object.keys(stats).forEach((queueName) => {
      dependencies.logger.info(
        {
          event: 'pg-boss-state',
          name: queueName,
          queue: stats[queueName],
        },
        'PGBOSS MONITOR-STATES',
      );
    });
  }
}
