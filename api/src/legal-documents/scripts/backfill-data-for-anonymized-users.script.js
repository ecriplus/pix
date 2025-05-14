import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../shared/domain/DomainTransaction.js';

export class BackfillDataForAnonymizedUsersScript extends Script {
  constructor() {
    super({
      description: 'Backfills accept date for anonymized users',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Run in dry mode ',
          demandOption: false,
        },
      },
    });
  }

  async handle({ options, logger }) {
    const { dryRun } = options;
    const knexConnection = DomainTransaction.getConnection();
    const rows = await knexConnection('legal-document-version-user-acceptances as a')
      .select('a.id', 'a.acceptedAt')
      .join('users as u', 'a.userId', 'u.id')
      .where('u.hasBeenAnonymised', true);
    logger.info(`Found ${rows.length} anonymized rows to ${dryRun ? 'process (dry run)' : 'update'}`);
    if (!dryRun) {
      for (const row of rows) {
        await knexConnection('legal-document-version-user-acceptances').where('id', row.id).del();
      }
      logger.info(`✅ Successfully updated ${rows.length} rows.`);
    } else {
      logger.info(`Dry run complete. No updates performed.`);
    }
  }
}

await ScriptRunner.execute(import.meta.url, BackfillDataForAnonymizedUsersScript);
