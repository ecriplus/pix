import { knex } from '../../db/knex-database-connection.js';
import { DEFAULT_SESSION_DURATION_MINUTES } from '../../src/certification/shared/domain/constants.js';
import { Frameworks } from '../../src/certification/shared/domain/models/Frameworks.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

const SOURCE_TABLE = 'certification-configurations';
const TARGET_TABLE = 'certification_versions';
const FRAMEWORKS_TABLE = 'certification-frameworks-challenges';
const ASSESSMENT_DURATION = DEFAULT_SESSION_DURATION_MINUTES;

export class MigrateCertificationConfigurationsToVersionsScript extends Script {
  constructor() {
    super({
      description:
        'Migrate existing CORE certification configurations from certification-configurations table to certification_versions table',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'Commit the INSERT or not',
          default: true,
        },
        versions: {
          type: 'array',
          describe: 'List of certification framework versions (format "YYYYMMDDHHMMSS") in chronological order',
          demandOption: true,
        },
      },
    });
  }

  async handle({ options, logger }) {
    const { dryRun, versions } = options;

    logger.info({ dryRun, versions });
    logger.info('Starting migration from certification-configurations to certification_versions...');

    const transaction = await knex.transaction();

    try {
      const configurations = await transaction(SOURCE_TABLE)
        .select(
          'startingDate',
          'expirationDate',
          'globalScoringConfiguration',
          'competencesScoringConfiguration',
          'challengesConfiguration',
        )
        .orderBy('startingDate', 'asc');

      if (configurations.length !== versions.length) {
        throw new Error('Configurations count should be the same as versions count');
      }

      logger.info(`Found ${configurations.length} configuration(s) to migrate.`);

      if (configurations.length === 0) {
        logger.info('No configurations to migrate.');
        await transaction.rollback();
        return 0;
      }

      for (let i = 0; i < configurations.length; i++) {
        const versionData = {
          scope: Frameworks.CORE,
          startDate: configurations[i].startingDate,
          expirationDate: configurations[i].expirationDate,
          assessmentDuration: ASSESSMENT_DURATION,
          globalScoringConfiguration: JSON.stringify(configurations[i].globalScoringConfiguration),
          competencesScoringConfiguration: JSON.stringify(configurations[i].competencesScoringConfiguration),
          challengesConfiguration: JSON.stringify(configurations[i].challengesConfiguration),
        };

        const [{ id: versionId }] = await transaction(TARGET_TABLE).insert(versionData).returning('id');

        await transaction(FRAMEWORKS_TABLE).where('version', versions[i]).update({
          versionId,
        });

        logger.info(
          `Migrated configuration with startDate: ${configurations[i].startingDate}, expirationDate: ${configurations[i].expirationDate || 'NULL'}`,
        );
      }

      if (dryRun) {
        await transaction.rollback();
        logger.info(`[⏳ Dry run] ${configurations.length} configuration(s) can be migrated.`);
      } else {
        await transaction.commit();
        logger.info(`✅ Migration completed successfully. ${configurations.length} configuration(s) migrated.`);
      }

      return 0;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

await ScriptRunner.execute(import.meta.url, MigrateCertificationConfigurationsToVersionsScript);
