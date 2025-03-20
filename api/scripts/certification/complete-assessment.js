import 'dotenv/config';

import { knex } from '../../db/knex-database-connection.js';
import { usecases } from '../../lib/domain/usecases/index.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { LOCALE } from '../../src/shared/domain/constants.js';
import { Assessment } from '../../src/shared/domain/models/Assessment.js';

const { FRENCH_FRANCE } = LOCALE;

export class CompleteAssessment extends Script {
  constructor() {
    super({
      description: 'Complete given assessment',
      permanent: false,
      options: {
        assessmentId: {
          type: 'integer',
          describe: 'Id of the assessment to be completed',
          demandOption: true,
        },
      },
    });
  }

  async handle({ options, logger, completeAssessment = usecases.completeAssessment }) {
    const { assessmentId } = options;
    this.logger = logger;

    const locale = FRENCH_FRANCE;
    await knex('assessments').where({ id: assessmentId }).update({ state: Assessment.states.STARTED });
    const assessment = await completeAssessment({ assessmentId, locale });

    this.logger.info(`AssessmentId ${assessment.id}`);

    return 0;
  }
}

await ScriptRunner.execute(import.meta.url, CompleteAssessment);
