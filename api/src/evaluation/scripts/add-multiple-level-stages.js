import Joi from 'joi';
import _ from 'lodash';
const { groupBy } = _;

import { csvFileParser } from '../../shared/application/scripts/parsers.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../shared/domain/DomainTransaction.js';
import { evaluationUsecases } from '../domain/usecases/index.js';

const columnSchemas = [
  { name: 'targetProfileId', schema: Joi.number().integer().positive().required() },
  { name: 'level', schema: Joi.number().integer().min(0).required() },
  { name: 'title', schema: Joi.string().max(255).required() },
  { name: 'message', schema: Joi.string().required() },
];

class AddMultipleLevelStagesScript extends Script {
  constructor() {
    super({
      description: 'Script to add multiple level stages',
      permanent: false,
      options: {
        file: {
          type: 'string',
          describe: 'CSV File containing multiple stages to add',
          demandOption: true,
          coerce: csvFileParser(columnSchemas),
        },
      },
    });
  }

  async handle({ options, logger }) {
    logger.info(`add-multiple-level-stages script has started`);

    const { file } = options;

    await DomainTransaction.execute(async () => {
      const stagesGroupedByTargetProfileId = groupBy(file, 'targetProfileId');
      for (const [targetProfileId, stageCollection] of Object.entries(stagesGroupedByTargetProfileId)) {
        logger.info(`${stageCollection.length} stages to create for target profile ${targetProfileId}`);
        const enrichedStageCollection = stageCollection.map((stage) => ({
          ...stage,
          prescriberTitle: stage.title,
          prescriberDescription: stage.message,
        }));
        await evaluationUsecases.createOrUpdateStageCollection({
          targetProfileId: parseInt(targetProfileId),
          stagesFromPayload: enrichedStageCollection,
        });
      }
    });
  }
}

await ScriptRunner.execute(import.meta.url, AddMultipleLevelStagesScript);

export { AddMultipleLevelStagesScript };
