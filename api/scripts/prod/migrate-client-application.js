import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { config } from '../../src/shared/config.js';
import { cryptoService } from '../../src/shared/domain/services/crypto-service.js';

export class MigrateClientApplicationScript extends Script {
  constructor() {
    super({
      description: 'This script will migrate client application from environment variables (config) to database.',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          default: true,
          description: 'when true does not insert to database',
        },
      },
    });
  }

  async handle({ options, logger }) {
    await knex.transaction(async (trx) => {
      const { apimRegisterApplicationsCredentials } = config;

      for (const clientApplication of apimRegisterApplicationsCredentials) {
        const query = trx('client_applications').insert({
          clientId: clientApplication.clientId,
          clientSecret: await cryptoService.hashPassword(clientApplication.clientSecret),
          name: clientApplication.source,
          scopes: [clientApplication.scope],
        });
        logger.info({ event: 'MigrateClientApplicationScript' }, query.toString());
        await query;
      }
      if (options.dryRun) {
        logger.info({ event: 'MigrateClientApplicationScript' }, 'Dry run, rolling back insertions');
        await trx.rollback();
      }
    });
  }
}

await ScriptRunner.execute(import.meta.url, MigrateClientApplicationScript);
