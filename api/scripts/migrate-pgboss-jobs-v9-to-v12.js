import { knex } from '../db/knex-database-connection.js';
import { ScriptRunner } from '../src/shared/application/scripts/script-runner.js';
import { ScriptWithJob } from '../src/shared/application/scripts/script-with-job.js';
import { JobClient } from '../src/shared/infrastructure/jobs/JobClient.js';

export class MigratePgbossJobsV9toV12Script extends ScriptWithJob {
  constructor() {
    super({
      description: 'Migrate pg-boss v9 jobs to v12',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          default: true,
        },
        jobTableName: {
          type: 'string',
          default: 'pgboss.job',
        },
      },
    });
  }

  async handle({ options, logger }) {
    await super.handle({ options, logger });

    const nonCompletedJobs = await knex
      .select()
      .from(options.jobTableName)
      .where('state', 'created')
      .andWhereNot('name', 'like', '\\_\\_%');

    logger.info(`${nonCompletedJobs.length} v9 jobs will be migrated`);

    for (const job of nonCompletedJobs) {
      if (!options.dryRun) {
        try {
          await JobClient.instance.send(job.name, job.data);
          await knex(options.jobTableName).update('name', `__migrated_${job.name}`).where('id', job.id);
        } catch (error) {
          logger.error(error, `Error while migrating job ${job.name} - ${job.id}`);
        }
      }
      logger.info(`Job ${job.name} - ${job.id} has been migrated`);
    }
  }
}

await ScriptRunner.execute(import.meta.url, MigratePgbossJobsV9toV12Script);
