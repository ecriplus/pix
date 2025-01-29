import 'dotenv/config';

import { knex } from '../../db/knex-database-connection.js';
import { SESSIONS_VERSIONS } from '../../src/certification/shared/domain/models/SessionVersion.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { PIX_ORIGIN } from '../../src/shared/domain/constants.js';
import { Assessment } from '../../src/shared/domain/models/Assessment.js';
import { logger } from '../../src/shared/infrastructure/utils/logger.js';

export class FixCompetenceMarksScript extends Script {
  constructor() {
    super({
      description: 'Fix "competenceId" in table "competence-marks" from bad referential origin',
      permanent: false,
      options: {},
    });

    this.dryRun = process.env.DRY_RUN !== 'false';
    this.batchSize = process.env.BATCH_SIZE || 100;
    this.cursorId = 0;
  }

  async handle() {
    logger.info(`dryRun=${this.dryRun} batchSize=${this.batchSize}`);

    let hasNext = true;
    do {
      // Step 1 : get bad competences marks with bad origin
      const competenceMarksToFix = await this.getBatchOfCompetenceMarksWithBadOrigin();
      this.cursorId = competenceMarksToFix?.at(-1)?.id;
      hasNext = competenceMarksToFix.length > 0;
      logger.info({ cursorId: this.cursorId, competenceMarksToFix });
    } while (hasNext);

    // Step 2 : get Pix core referential

    // Step 3 : Find new comptence id for each bad comptences marks

    // Step 4 :Update comptence mark with new comptenceId

    return 0;
  }

  async getBatchOfCompetenceMarksWithBadOrigin() {
    return knex
      .from('public.competence-marks')
      .select(
        'public.competence-marks.id',
        'public.competence-marks.competenceId',
        'learningcontent.competences.origin',
      )
      .innerJoin('public.assessment-results', 'competence-marks.assessmentResultId', 'assessment-results.id')
      .innerJoin(
        'learningcontent.competences',
        'learningcontent.competences.id',
        'public.competence-marks.competenceId',
      )
      .innerJoin('public.assessments', 'public.assessments.id', 'public.assessment-results.assessmentId')
      .innerJoin(
        'public.certification-courses',
        'public.certification-courses.id',
        'public.assessments.certificationCourseId',
      )
      .innerJoin('public.sessions', 'public.sessions.id', 'public.certification-courses.sessionId')
      .where('public.sessions.version', '=', SESSIONS_VERSIONS.V3)
      .andWhere('public.assessments.type', '=', Assessment.types.CERTIFICATION)
      .andWhere('learningcontent.competences.origin', '!=', PIX_ORIGIN)
      .andWhere('public.competence-marks.id', '>', this.cursorId)
      .orderBy('public.competence-marks.id')
      .limit(this.batchSize);
  }
}

await ScriptRunner.execute(import.meta.url, FixCompetenceMarksScript);
