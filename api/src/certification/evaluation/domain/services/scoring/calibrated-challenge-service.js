/**
 * @typedef {import('../index.js').ChallengeCalibrationRepository} ChallengeCalibrationRepository
 * @typedef {import('../index.js').ChallengeRepository} ChallengeRepository
 * @typedef {import('../index.js').CertificationChallengeLiveAlertRepository} CertificationChallengeLiveAlertRepository
 */
import differenceBy from 'lodash/differenceBy.js';

import { withTransaction } from '../../../../../shared/domain/DomainTransaction.js';

export const findByCertificationCourseIdAndAssessmentId = withTransaction(
  /**
   * @param {Object} params
   * @param {ChallengeCalibrationRepository} params.challengeCalibrationRepository
   * @param {CertificationChallengeLiveAlertRepository} params.certificationChallengeLiveAlertRepository
   * @param {ChallengeRepository} params.challengeRepository
   */
  async ({
    certificationCourseId,
    assessmentId,
    challengeCalibrationRepository,
    certificationChallengeLiveAlertRepository,
    sharedChallengeRepository,
    challengeRepository,
  }) => {
    const flashCompatibleChallenges = await challengeRepository.findFlashCompatibleWithoutLocale({
      useObsoleteChallenges: true,
      fromArchivedCalibration: false,
    });

    const { allChallenges, askedChallenges, challengeCalibrations } = await _findByCertificationCourseId({
      compatibleChallenges: flashCompatibleChallenges,
      certificationCourseId,
      challengeCalibrationRepository,
      sharedChallengeRepository,
    });

    const { challengeCalibrationsWithoutLiveAlerts, askedChallengesWithoutLiveAlerts } =
      await _removeChallengesWithValidatedLiveAlerts(
        challengeCalibrations,
        assessmentId,
        askedChallenges,
        certificationChallengeLiveAlertRepository,
      );

    return { allChallenges, askedChallengesWithoutLiveAlerts, challengeCalibrationsWithoutLiveAlerts };
  },
);

/**
 * @param {Object} params
 * @param {ChallengeCalibrationRepository} params.challengeCalibrationRepository
 */
const _findByCertificationCourseId = async ({
  compatibleChallenges,
  certificationCourseId,
  challengeCalibrationRepository,
  sharedChallengeRepository,
}) => {
  const challengeCalibrations = await challengeCalibrationRepository.getByCertificationCourseId({
    certificationCourseId,
  });

  const askedChallenges = await sharedChallengeRepository.getMany(
    challengeCalibrations.map((challenge) => challenge.id),
  );

  _restoreCalibrationValues(challengeCalibrations, askedChallenges);

  const flashCompatibleChallengesNotAskedInCertification = differenceBy(compatibleChallenges, askedChallenges, 'id');

  const allChallenges = [...askedChallenges, ...flashCompatibleChallengesNotAskedInCertification];

  return { allChallenges, askedChallenges, challengeCalibrations };
};

/**
 * @param {CertificationChallengeLiveAlertRepository} certificationChallengeLiveAlertRepository
 */
async function _removeChallengesWithValidatedLiveAlerts(
  challengeCalibrations,
  assessmentId,
  askedChallenges,
  certificationChallengeLiveAlertRepository,
) {
  const validatedLiveAlertChallengeIds =
    await certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId({
      assessmentId,
    });
  const challengeCalibrationsWithoutLiveAlerts = challengeCalibrations.filter(
    (challengeCalibration) => !validatedLiveAlertChallengeIds.includes(challengeCalibration.id),
  );
  const askedChallengesWithoutLiveAlerts = askedChallenges.filter(
    (askedChallenge) => !validatedLiveAlertChallengeIds.includes(askedChallenge.id),
  );
  return { challengeCalibrationsWithoutLiveAlerts, askedChallengesWithoutLiveAlerts };
}

function _restoreCalibrationValues(challengeCalibrations, askedChallenges) {
  challengeCalibrations.forEach((certificationChallenge) => {
    const askedChallenge = askedChallenges.find(({ id }) => id === certificationChallenge.id);
    askedChallenge.discriminant = certificationChallenge.discriminant;
    askedChallenge.difficulty = certificationChallenge.difficulty;
  });
}
