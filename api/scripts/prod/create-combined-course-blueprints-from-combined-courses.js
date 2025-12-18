import { createHash } from 'node:crypto';

import { knex } from '../../db/knex-database-connection.js';
import { CombinedCourseDetails } from '../../src/quest/domain/models/CombinedCourse.js';
import { CombinedCourseBlueprint } from '../../src/quest/domain/models/CombinedCourseBlueprint.js';
import { REQUIREMENT_TYPES } from '../../src/quest/domain/models/Quest.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

export class CreateCombinedCourseBlueprint extends Script {
  constructor() {
    super({
      description: 'Create combined course blueprint based on existing combined courses',
      permanent: true,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'dry run mode (changes are not persisted in Db)',
          default: true,
        },
      },
    });
  }

  async handle({ options, logger }) {
    const { dryRun } = options;
    const trx = await knex.transaction();
    const blueprintMap = new Map();
    const combinedCoursesWithoutBlueprint = await trx('combined_courses')
      .join('quests', 'questId', 'quests.id')
      .select('combined_courses.*', 'successRequirements')
      .whereNull('combinedCourseBlueprintId');

    if (combinedCoursesWithoutBlueprint.length === 0) {
      logger.info(`Nothing to update...`);
      await trx.rollback();
      return;
    }

    logger.info(`Try to update ${combinedCoursesWithoutBlueprint.length} combined_courses rows`);

    for (const combinedCourse of combinedCoursesWithoutBlueprint) {
      const details = new CombinedCourseDetails(combinedCourse, combinedCourse);
      const campaigns = await trx('campaigns').select('id', 'targetProfileId').whereIn('id', details.campaignIds);

      const combinedCourseBlueprint = {
        name: combinedCourse.name,
        internalName: `Modèle de ${combinedCourse.name}`,
        description: combinedCourse.description,
        illustration: combinedCourse.illustration,
        content: JSON.stringify(this.buildCombinedCourseBlueprintContent(combinedCourse, campaigns)),
      };

      const contentHash = hash(combinedCourseBlueprint.content);

      if (!blueprintMap.has(contentHash)) {
        const [blueprint] = await trx('combined_course_blueprints').insert(combinedCourseBlueprint).returning('id');
        blueprintMap.set(contentHash, blueprint.id);
      }
      const blueprintId = blueprintMap.get(contentHash);
      await trx('combined_courses').update({ combinedCourseBlueprintId: blueprintId }).where('id', combinedCourse.id);
    }

    logger.info(`Created ${blueprintMap.size} combined_course_blueprints`);
    logger.info(`Successfully updated ${combinedCoursesWithoutBlueprint.length} combined_courses`);

    if (dryRun) {
      await trx.rollback();
      logger.info(`Rollback updates - use --dryRun true to persist changes`);
    } else {
      logger.info(`Commit updates...`);
      await trx.commit();
    }
  }

  buildCombinedCourseBlueprintContent(combinedCourse, campaigns) {
    return CombinedCourseBlueprint.buildContentItems(
      combinedCourse.successRequirements.map((successRequirement) => {
        if (successRequirement.requirement_type === REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS) {
          const campaign = campaigns.find(({ id }) => id === successRequirement.data.campaignId.data);

          return { targetProfileId: campaign.targetProfileId };
        }
        if (successRequirement.requirement_type === REQUIREMENT_TYPES.OBJECT.PASSAGES) {
          return { moduleId: successRequirement.data.moduleId.data };
        }
      }),
    );
  }
}
const hash = (content) => createHash('sha256').update(content).digest('hex');

await ScriptRunner.execute(import.meta.url, CreateCombinedCourseBlueprint);
