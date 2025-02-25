import Debug from 'debug';
import differenceBy from 'lodash/differenceBy.js';

const debugScoringForV3Certification = Debug('pix:certif:v3:scoring');

export const findByCertificationCourseIdAndAssessmentId = async ({
  certificationCourseId,
  assessmentId,
  challengeCalibrationRepository,
  certificationChallengeLiveAlertRepository,
  challengeRepository,
}) => {
  const flashCompatibleChallenges = await challengeRepository.findFlashCompatibleWithoutLocale({
    useObsoleteChallenges: true,
  });
  debugScoringForV3Certification(`FlashCompatibleChallenges count: ${flashCompatibleChallenges.length}`);

  const { allChallenges, askedChallenges, challengeCalibrations } = await _findByCertificationCourseId({
    compatibleChallenges: flashCompatibleChallenges,
    certificationCourseId,
    challengeCalibrationRepository,
    challengeRepository,
  });

  const { challengeCalibrationsWithoutLiveAlerts, askedChallengesWithoutLiveAlerts } =
    await _removeChallengesWithValidatedLiveAlerts(
      challengeCalibrations,
      assessmentId,
      askedChallenges,
      certificationChallengeLiveAlertRepository,
    );

  return { allChallenges, askedChallengesWithoutLiveAlerts, challengeCalibrationsWithoutLiveAlerts };
};

const _findByCertificationCourseId = async ({
  compatibleChallenges,
  certificationCourseId,
  challengeCalibrationRepository,
  challengeRepository,
}) => {
  const challengeCalibrations = await challengeCalibrationRepository.getByCertificationCourseId({
    certificationCourseId,
  });

  const askedChallenges = await challengeRepository.getMany(challengeCalibrations.map((challenge) => challenge.id));

  _restoreCalibrationValues(challengeCalibrations, askedChallenges);

  const flashCompatibleChallengesNotAskedInCertification = differenceBy(compatibleChallenges, askedChallenges, 'id');

  const allChallenges = [...askedChallenges, ...flashCompatibleChallengesNotAskedInCertification];

  debugScoringForV3Certification(
    `Challenges after FlashCompatibleChallenges & CandidateAnswers merge count: ${allChallenges.length}`,
  );

  return { allChallenges, askedChallenges, challengeCalibrations };
};

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
