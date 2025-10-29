/**
 * @typedef {import ('./index.js').ActiveCalibratedChallengeRepository} ActiveCalibratedChallengeRepository
 * @typedef {import ('./index.js').FrameworkChallengesRepository} FrameworkChallengesRepository
 * @typedef {import ('./index.js').VersionsRepository} VersionsRepository
 * @typedef {import ('../models/CertificationFrameworksChallenge.js').CertificationFrameworksChallenge} CertificationFrameworksChallenge
 * @typedef {import ('../read-models/ActiveCalibratedChallenge.js').ActiveCalibratedChallenge} ActiveCalibratedChallenge
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';

export const calibrateFrameworkVersion = withTransaction(
  /**
   * @param {Object} params
   * @param {number} params.versionId
   * @param {number} params.calibrationId
   * @param {FrameworkChallengesRepository} params.frameworkChallengesRepository
   * @param {ActiveCalibratedChallengeRepository} params.activeCalibratedChallengeRepository
   * @param {VersionsRepository} params.versionsRepository
   * @returns {Promise<void>}
   */
  async ({
    versionId,
    calibrationId,
    frameworkChallengesRepository,
    activeCalibratedChallengeRepository,
    versionsRepository,
  }) => {
    const version = await versionsRepository.getById({ id: versionId });
    const challenges = await frameworkChallengesRepository.getByVersionId({ versionId });

    const activeCalibratedChallenges = await activeCalibratedChallengeRepository.getByComplementaryKeyAndCalibrationId({
      scope: version.scope,
      calibrationId,
    });

    _calibrateFrameworkChallenges({
      challenges,
      activeCalibratedChallenges,
    });

    return frameworkChallengesRepository.update(challenges);
  },
);

/**
 * @param {Array<CertificationFrameworksChallenge>} challenges
 * @param {Array<ActiveCalibratedChallenge>} activeCalibratedChallenges
 */
const _calibrateFrameworkChallenges = ({ challenges, activeCalibratedChallenges }) => {
  for (let source = 0, target = 0; source < activeCalibratedChallenges.length; source++, target++) {
    while (activeCalibratedChallenges[source].challengeId !== challenges[target]?.challengeId) {
      if (!challenges[target]) {
        throw new NotFoundError(
          `The challenge ${activeCalibratedChallenges[source].challengeId} does not exist in the framework challenges`,
        );
      }
      target++;
    }

    const frameworkChallenge = challenges[target];
    frameworkChallenge.calibrate(activeCalibratedChallenges[source]);
  }
};
