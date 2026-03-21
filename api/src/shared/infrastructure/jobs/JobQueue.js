import { executeInContext, EXECUTORS } from '../execution-context-manager.js';
import { logger } from '../utils/logger.js';
import { MonitoredJobHandler } from './monitoring/MonitoredJobHandler.js';
import { MonitoringJobExecutionTimeHandler } from './monitoring/MonitoringJobExecutionTimeHandler.js';

class JobQueue {
  constructor(pgBoss) {
    this.pgBoss = pgBoss;
  }

  register(metrics, name, handlerClass) {
    const jobHandler = new handlerClass();
    const { teamConcurrency, teamSize } = jobHandler;
    this.pgBoss.work(name, { teamSize, teamConcurrency }, async (job) => {
      const context = initContext(job);
      return executeInContext(
        context,
        async () => {
          const monitoredJobHandler = new MonitoredJobHandler(metrics, jobHandler, logger);
          return monitoredJobHandler.handle({ data: job.data, jobName: name, jobId: job.id });
        },
        EXECUTORS.JOB,
      );
    });

    this.pgBoss.onComplete(name, { teamSize, teamConcurrency }, (job) => {
      const context = initContext(job);
      return executeInContext(
        context,
        async () => {
          const monitoringJobHandler = new MonitoringJobExecutionTimeHandler({ logger });
          return monitoringJobHandler.handle(job);
        },
        EXECUTORS.JOB,
      );
    });
  }

  scheduleCronJob({ name, cron, data, options }) {
    return this.pgBoss.schedule(name, cron, data, options);
  }

  unscheduleCronJob(name) {
    return this.pgBoss.unschedule(name);
  }

  async stop() {
    await this.pgBoss.stop({ graceful: false, timeout: 1000, destroy: true });
  }
}

function initContext(job) {
  const inheritedContext = job.data?.correlationContext ?? {};
  return {
    ...inheritedContext,
    jobId: job.id,
  };
}

export { JobQueue };
