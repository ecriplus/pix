/**
 * @typedef {import('../index.js').ChallengeCalibrationRepository} ChallengeCalibrationRepository
 * @typedef {import('../index.js').ChallengeRepository} ChallengeRepository
 * @typedef {import('../index.js').CertificationChallengeLiveAlertRepository} CertificationChallengeLiveAlertRepository
 * @typedef {import('../index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('../index.js').SharedChallengeRepository} SharedChallengeRepository
 * @typedef {import('../../../../../shared/domain/models/Challenge.js').Challenge} Challenge
 * @typedef {import('../../../../scoring/domain/read-models/ChallengeCalibration.js').ChallengeCalibration} ChallengeCalibration
 * @typedef {import('../../../../shared/domain/models/Version.js').Version} Version
 * @typedef {import('../../../../shared/domain/models/CertificationCourse.js').CertificationCourse} CertificationCourse
 */
import { withTransaction } from '../../../../../shared/domain/DomainTransaction.js';

export const findByCertificationCourseIdAndAssessmentId = withTransaction(
  /**
   * @param {Object} params
   * @param {CertificationCourse} params.certificationCourse
   * @param {Version} params.version
   * @param {number} params.assessmentId
   * @param {ChallengeCalibrationRepository} params.challengeCalibrationRepository
   * @param {CertificationChallengeLiveAlertRepository} params.certificationChallengeLiveAlertRepository
   * @param {SharedChallengeRepository} params.sharedChallengeRepository
   * @param {ChallengeRepository} params.challengeRepository
   */
  async ({
    certificationCourse,
    version,
    assessmentId,
    challengeCalibrationRepository,
    certificationChallengeLiveAlertRepository,
    challengeRepository,
  }) => {
    const flashCompatibleChallenges = await challengeRepository.findAllCalibratedChallenges(version);

    const { allChallenges, askedChallenges, challengesCalibrations } = await _findByCertificationCourseId({
      compatibleChallenges: flashCompatibleChallenges,
      certificationCourseId: certificationCourse.getId(),
      challengeCalibrationRepository,
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
 * @param {Array<Challenge>} params.compatibleChallenges
 * @param {number} params.certificationCourseId
 * @param {ChallengeCalibrationRepository} params.challengeCalibrationRepository
 * @returns {Promise<Object>}
 * @property {Array<Challenge>} allChallenges - all challenges data + calibration for this version
 * @property {Array<Challenge>} askedChallenges - all challenges data + calibrations PRESENTED to candidate
 * @property {Array<ChallengeCalibration>} challengesCalibrations - only calibrations of challenges PRESENTED to candidate
 */
const _findByCertificationCourseId = async ({
  compatibleChallenges,
  certificationCourseId,
  challengeCalibrationRepository,
}) => {
  const challengesCalibrations = await challengeCalibrationRepository.getByCertificationCourseId({
    certificationCourseId,
  });

  const askedChallenges = compatibleChallenges.filter((challenge) => {
    return challengesCalibrations.find((calibration) => challenge.id === calibration.id);
  });
  return { allChallenges: compatibleChallenges, askedChallenges, challengesCalibrations };
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
