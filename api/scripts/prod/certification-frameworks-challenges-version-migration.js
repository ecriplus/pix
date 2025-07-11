import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

class CertificationFrameworksChallengesVersionMigration extends Script {
  constructor() {
    super({
      description: 'Script oneshot to migrate createdAt value to a well formatted version column',
      permanent: false,
    });
  }

  async handle({ logger }) {
    logger.info('initialization of vertsion column for CertificationFrameworksChallenges');
    const certificationFrameworksChallengesToUpdate = await knex('certification-frameworks-challenges');

    for (let i = 0; i < certificationFrameworksChallengesToUpdate.length; i++) {
      const certificationFrameworksChallenge = certificationFrameworksChallengesToUpdate[i];
      const createdAt = certificationFrameworksChallenge.createdAt;
      const version = this.getVersionNumber(createdAt);
      await knex('certification-frameworks-challenges')
        .where({ id: certificationFrameworksChallenge.id })
        .update({ version });
    }
    logger.info(`${certificationFrameworksChallengesToUpdate.length} certification-frameworks-challenges rows updated`);
  }

  getVersionNumber(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return (
      date.getUTCFullYear().toString() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getSeconds())
    );
  }
}
await ScriptRunner.execute(import.meta.url, CertificationFrameworksChallengesVersionMigration);
