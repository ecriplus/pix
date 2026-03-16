import { usecases } from '../../src/quest/domain/usecases/index.js';
import * as combinedCourseBlueprintRepository from '../../src/quest/infrastructure/repositories/combined-course-blueprint-repository.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../src/shared/domain/DomainTransaction.js';

export class AttachQuestToExistingCombinedCourseBlueprintsScript extends Script {
  constructor() {
    super({
      description: 'This script will create a quest for the existing combined course blueprints without quest',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          default: true,
        },
      },
    });
  }
  async handle({
    options,
    logger,
    dependencies = {
      createCombinedCourseBlueprint: usecases.createCombinedCourseBlueprint,
      combinedCourseBlueprintRepository,
    },
  }) {
    await DomainTransaction.execute(async () => {
      const knexConn = DomainTransaction.getConnection();
      try {
        const combinedCourseBlueprints = await dependencies.combinedCourseBlueprintRepository.findAll();
        const combinedCourseBlueprintsToUpdate = combinedCourseBlueprints.filter(
          (combinedCourseBlueprint) => !combinedCourseBlueprint.quest,
        );

        logger.info(`${combinedCourseBlueprintsToUpdate.length} quests to create.`);

        for (const combinedCourseBlueprint of combinedCourseBlueprintsToUpdate) {
          await dependencies.createCombinedCourseBlueprint({ combinedCourseBlueprint });
        }
        if (options.dryRun) {
          await knexConn.rollback();
          logger.info(`ROLLBACK due to dryRun`);
          logger.info(`--dryRun true to persist changes`);
          return;
        }
      } catch (error) {
        await knexConn.rollback();
        logger.error(
          { event: 'AttachQuestToExistingCombinedCourseBlueprintsScript' },
          `ROLLBACK: An error has occured, ${error}`,
        );
        throw error;
      }
    });
  }
}
await ScriptRunner.execute(import.meta.url, AttachQuestToExistingCombinedCourseBlueprintsScript);
