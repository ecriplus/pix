import 'dotenv/config';

import dayjs from 'dayjs';

import { knex as datamartKnex } from '../../datamart/knex-database-connection.js';
import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { config } from '../../src/shared/config.js';

export class SyncDatamartWithLCMSChallenges extends Script {
  constructor() {
    super({
      description: '[NOT FOR PROD] Sync datamart with with another calibration than LCMS calibrated challenges',
      permanent: false,
      options: {},
    });

    this.totalNumberOfUpdatedRows = 0;
  }

  async handle({ _options, logger }) {
    this.logger = logger;

    if (!config.v3Certification.certificationCoreCalibration2024Id) {
      throw new Error('missing CERTIFICATION_CORE_CALIBRATION_2024_ID');
    }

    const calibrationConf = {
      certificationCoreCalibration2024Id: config.v3Certification.certificationCoreCalibration2024Id,
    };

    this.logger.info({ ...calibrationConf });

    const challengesFromLCMS = await knex('learningcontent.challenges').whereNotNull('alpha').whereNotNull('delta');

    const deleted = await datamartKnex('data_active_calibrated_challenges').del();
    this.logger.info(`Deleted ${deleted} challenges from old calibrations`);

    await datamartKnex('data_calibrations').del();
    this.logger.info(`Deleted ${deleted} old calibration`);

    await datamartKnex('data_calibrations').insert({
      id: calibrationConf.certificationCoreCalibration2024Id,
      calibration_date: dayjs().toDate(),
      status: 'VALIDATED',
      scope: 'COEUR',
    });

    const newPixCoeur = challengesFromLCMS.map((challenge) => {
      return {
        challenge_id: challenge.id,
        alpha: Math.floor(challenge.alpha),
        delta: Math.floor(challenge.delta),
        calibration_id: calibrationConf.certificationCoreCalibration2024Id,
      };
    });

    const { length } = await datamartKnex
      .batchInsert('data_active_calibrated_challenges', newPixCoeur)
      .returning('challenge_id');

    this.logger.info(`Datamart is now synchronized for ${length} challenges`);

    return 0;
  }
}

await ScriptRunner.execute(import.meta.url, SyncDatamartWithLCMSChallenges);
