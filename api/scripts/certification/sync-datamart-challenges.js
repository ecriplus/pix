import 'dotenv/config';

import dayjs from 'dayjs';

import { knex as datamartKnex } from '../../datamart/knex-database-connection.js';
import { knex } from '../../db/knex-database-connection.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';
import { config } from '../../src/shared/config.js';

export class SyncDatamartChallenges extends Script {
  constructor() {
    super({
      description: '[NOT FOR PROD] Sync datamart with challenges from certification-courses',
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
    if (!config.v3Certification.latestCalibrationDate) {
      throw new Error('missing LATEST_CERTIFICATION_CALIBRATION_DATE');
    }

    const calibrationConf = {
      certificationCoreCalibration2024Id: config.v3Certification.certificationCoreCalibration2024Id,
      latestCalibrationDate: config.v3Certification.latestCalibrationDate,
    };

    this.logger.info({ ...calibrationConf });

    const certifChallenges = await knex
      .with('ranked_rows', (qb) => {
        qb.select(
          'challengeId',
          'discriminant',
          'difficulty',
          knex.raw('ROW_NUMBER() OVER (PARTITION BY "challengeId" ORDER BY "createdAt" DESC) as row_num'),
        )
          .from('certification-challenges')
          .where('certification-challenges.createdAt', '<=', calibrationConf.latestCalibrationDate);
      })
      .select('challengeId', 'discriminant', 'difficulty')
      .from('ranked_rows')
      .where('row_num', 1);

    const deleted = await datamartKnex('data_active_calibrated_challenges')
      .where('calibration_id', calibrationConf.certificationCoreCalibration2024Id)
      .del();
    this.logger.info(`Deleted ${deleted} from old calibration ${calibrationConf.certificationCoreCalibration2024Id}`);

    await datamartKnex('data_calibrations').where('id', calibrationConf.certificationCoreCalibration2024Id).del();
    this.logger.info(`Deleted ${deleted} old calibration ${calibrationConf.certificationCoreCalibration2024Id}`);

    await datamartKnex('data_calibrations').insert({
      id: calibrationConf.certificationCoreCalibration2024Id,
      calibration_date: dayjs().toDate(),
      status: 'VALIDATED',
      scope: 'COEUR',
    });

    const newPixCoeur = certifChallenges.map((challenge) => {
      return {
        challenge_id: challenge.challengeId,
        alpha: challenge.discriminant,
        delta: challenge.difficulty,
        calibration_id: calibrationConf.certificationCoreCalibration2024Id,
      };
    });

    const { length } = await datamartKnex
      .batchInsert('data_active_calibrated_challenges', newPixCoeur)
      .returning('challenge_id');

    this.logger.info(
      `Datamart is now synchronized for ${length} challenges before date: ${calibrationConf.latestCalibrationDate}`,
    );

    return 0;
  }
}

await ScriptRunner.execute(import.meta.url, SyncDatamartChallenges);
