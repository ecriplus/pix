import ComplementaryCertificationTubes from '../../db/seeds/data/team-certification/cases/complementary-certification-challenges.js';
import { ComplementaryCertificationKeys } from '../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { LOCALE } from '../../src/shared/domain/constants.js';
import * as challengeRepository from '../../src/shared/infrastructure/repositories/challenge-repository.js';
import * as skillRepository from '../../src/shared/infrastructure/repositories/skill-repository.js';
import * as tubeRepository from '../../src/shared/infrastructure/repositories/tube-repository.js';

async function insertCalibrations({ knex }) {
  const id = nextCalibrationId();
  await knex.batchInsert('data_calibrations', [
    {
      id,
      calibration_date: new Date(),
      status: 'VALIDATED',
      scope: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
    },
  ]);
  await insertActiveCalibratedChallenges({ knex, calibrationId: id });
}

async function insertActiveCalibratedChallenges({ knex, calibrationId }) {
  const tubes = await tubeRepository.findActiveByRecordIds(
    ComplementaryCertificationTubes[0].tubeIds,
    LOCALE.FRENCH_SPOKEN,
  );

  const skillIds = tubes.flatMap((tube) => tube.skillIds);
  const skills = await skillRepository.findActiveByRecordIds(skillIds);

  const challenges = await challengeRepository.findOperativeBySkills(skills, LOCALE.FRENCH_SPOKEN);

  const activeCalibratedChallenges = challenges.map((challenge) => {
    return {
      calibration_id: calibrationId,
      challenge_id: challenge.id,
      alpha: 2.3,
      delta: 5.1,
    };
  });
  await knex.batchInsert('data_active_calibrated_challenges', activeCalibratedChallenges);
}

function nextCalibrationId(startingFrom = 10000) {
  return startingFrom++;
}

export async function seed(knex) {
  insertCalibrations({ knex });
}
