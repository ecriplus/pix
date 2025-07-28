/**
 * @typedef {import('../index.js').ChallengeCalibrationRepository} ChallengeCalibrationRepository
 * @typedef {import('../index.js').ChallengeRepository} ChallengeRepository
 * @typedef {import('../index.js').CertificationChallengeLiveAlertRepository} CertificationChallengeLiveAlertRepository
 * @typedef {import('../index.js').CertificationCourseRepository} CertificationCourseRepository
 */
import differenceBy from 'lodash/differenceBy.js';

import { config } from '../../../../../shared/config.js';
import { withTransaction } from '../../../../../shared/domain/DomainTransaction.js';

export const findByCertificationCourseIdAndAssessmentId = withTransaction(
  /**
   * @param {Object} params
   * @param {ChallengeCalibrationRepository} params.challengeCalibrationRepository
   * @param {CertificationChallengeLiveAlertRepository} params.certificationChallengeLiveAlertRepository
   * @param {ChallengeRepository} params.challengeRepository
   * @param {CertificationCourseRepository} params.certificationCourseRepository
   */
  async ({
    certificationCourseId,
    assessmentId,
    challengeCalibrationRepository,
    certificationChallengeLiveAlertRepository,
    sharedChallengeRepository,
    challengeRepository,
    certificationCourseRepository,
  }) => {
    const fromArchivedCalibration = await _isOldCalibration({ certificationCourseId, certificationCourseRepository });

    const flashCompatibleChallenges = await challengeRepository.findFlashCompatibleWithoutLocale({
      useObsoleteChallenges: true,
      fromArchivedCalibration,
    });

    const { allChallenges, askedChallenges, challengesCalibrations } = await _findByCertificationCourseId({
      compatibleChallenges: flashCompatibleChallenges,
      certificationCourseId,
      challengeCalibrationRepository,
      sharedChallengeRepository,
      challengeRepository,
      fromArchivedCalibration,
    });

    const { challengeCalibrationsWithoutLiveAlerts, askedChallengesWithoutLiveAlerts } =
      await _removeChallengesWithValidatedLiveAlerts(
        challengesCalibrations,
        assessmentId,
        askedChallenges,
        certificationChallengeLiveAlertRepository,
      );

    return { allChallenges, askedChallengesWithoutLiveAlerts, challengeCalibrationsWithoutLiveAlerts };
  },
);

/**
 * @param {Object} params
 * @param {number} params.certificationCourseId
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 */
const _isOldCalibration = async ({ certificationCourseId, certificationCourseRepository }) => {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });
  const latestCalibrationDate = config.v3Certification.latestCalibrationDate;
  return certificationCourse.getStartDate() < latestCalibrationDate;
};

/**
 * @param {Object} params
 * @param {ChallengeCalibrationRepository} params.challengeCalibrationRepository
 */
const _findByCertificationCourseId = async ({
  compatibleChallenges,
  certificationCourseId,
  challengeCalibrationRepository,
  sharedChallengeRepository,
  fromArchivedCalibration = false,
}) => {
  const challengesCalibrations = await challengeCalibrationRepository.getByCertificationCourseId({
    certificationCourseId,
  });

  if (fromArchivedCalibration) {
    const askedChallenges = compatibleChallenges.filter((challenge) => {
      return challengesCalibrations.find((calibration) => challenge.id === calibration.id);
    });
    return { allChallenges: compatibleChallenges, askedChallenges, challengesCalibrations };
  }

  const askedChallenges = await sharedChallengeRepository.getMany(
    challengesCalibrations.map((challenge) => challenge.id),
  );

  _restoreCalibrationValues(challengesCalibrations, askedChallenges);

  const flashCompatibleChallengesNotAskedInCertification = differenceBy(compatibleChallenges, askedChallenges, 'id');

  const allChallenges = [...askedChallenges, ...flashCompatibleChallengesNotAskedInCertification];

  return { allChallenges, askedChallenges, challengesCalibrations };
};

/**
 * @param {CertificationChallengeLiveAlertRepository} certificationChallengeLiveAlertRepository
 */
async function _removeChallengesWithValidatedLiveAlerts(
  challengesCalibrations,
  assessmentId,
  askedChallenges,
  certificationChallengeLiveAlertRepository,
) {
  const validatedLiveAlertChallengeIds =
    await certificationChallengeLiveAlertRepository.getLiveAlertValidatedChallengeIdsByAssessmentId({
      assessmentId,
    });
  const challengeCalibrationsWithoutLiveAlerts = challengesCalibrations.filter(
    (challengeCalibration) => !validatedLiveAlertChallengeIds.includes(challengeCalibration.id),
  );
  const askedChallengesWithoutLiveAlerts = askedChallenges.filter(
    (askedChallenge) => !validatedLiveAlertChallengeIds.includes(askedChallenge.id),
  );
  return { challengeCalibrationsWithoutLiveAlerts, askedChallengesWithoutLiveAlerts };
}

function _restoreCalibrationValues(challengesCalibrations, askedChallenges) {
  challengesCalibrations.forEach((certificationChallenge) => {
    const askedChallenge = askedChallenges.find(({ id }) => id === certificationChallenge.id);
    askedChallenge.discriminant = certificationChallenge.discriminant;
    askedChallenge.difficulty = certificationChallenge.difficulty;
  });
}
