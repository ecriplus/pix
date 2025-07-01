/**
 * @typedef {import ('./index.js').CertificationFrameworksChallengeRepository} CertificationFrameworksChallengeRepository
 * @typedef {import ('./index.js').ActiveCalibratedChallengeRepository} ActiveCalibratedChallengeRepository
 * @typedef {import ('../models/ConsolidatedFramework.js').ConsolidatedFramework} ConsolidatedFramework
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('../models/CertificationFrameworksChallenge.js').CertificationFrameworksChallenge} CertificationFrameworksChallenge
 * @typedef {import ('../read-models/ActiveCalibratedChallenge.js').ActiveCalibratedChallenge} ActiveCalibratedChallenge
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';

export const calibrateConsolidatedFramework = withTransaction(
  /**
   * @param {Object} params
   * @param {Date} params.createdAt
   * @param {number} params.calibrationId
   * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
   * @param {ConsolidatedFrameworkRepository} params.consolidatedFrameworkRepository
   * @param {ActiveCalibratedChallengeRepository} params.activeCalibratedChallengeRepository
   * @returns {Promise<void>}
   */
  async ({
    createdAt,
    calibrationId,
    complementaryCertificationKey,
    consolidatedFrameworkRepository,
    activeCalibratedChallengeRepository,
  }) => {
    const consolidatedFramework = await consolidatedFrameworkRepository.findByCreationDateAndComplementaryKey({
      complementaryCertificationKey,
      createdAt,
    });

    const activeCalibratedChallenges = await activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId(
      {
        complementaryCertificationKey,
        calibrationId,
      },
    );

    if (activeCalibratedChallenges.length === 0) {
      throw new NotFoundError(`Not found calibration (id: ${calibrationId}) for ${complementaryCertificationKey}`);
    }

    consolidatedFramework.calibrationId = calibrationId;
    _calibrateChallenges(activeCalibratedChallenges, consolidatedFramework.challenges);

    return consolidatedFrameworkRepository.save(consolidatedFramework);
  },
);

/**
 * @param {Array<ActiveCalibratedChallenge>} activeCalibratedChallenges
 * @param {Array<CertificationFrameworksChallenge>} challengesToCalibrate
 */
const _calibrateChallenges = (activeCalibratedChallenges, challengesToCalibrate) => {
  for (let source = 0, target = 0; source < activeCalibratedChallenges.length; source++, target++) {
    while (activeCalibratedChallenges[source].challengeId !== challengesToCalibrate[target].challengeId) {
      target++;
    }

    const frameworkChallenge = challengesToCalibrate[target];
    frameworkChallenge.calibrate(activeCalibratedChallenges[source]);
  }
};
