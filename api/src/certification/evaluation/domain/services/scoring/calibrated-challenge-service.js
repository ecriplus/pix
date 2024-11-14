import Debug from 'debug';
import differenceBy from 'lodash/differenceBy.js';

const debugScoringForV3Certification = Debug('pix:certif:v3:scoring');

export const findByCertificationCourseIdForScoring = async ({
  certificationCourseId,
  certificationChallengeForScoringRepository,
  challengeRepository,
}) => {
  const flashCompatibleChallenges = await challengeRepository.findFlashCompatibleWithoutLocale({
    useObsoleteChallenges: true,
  });
  debugScoringForV3Certification(`FlashCompatibleChallenges count: ${flashCompatibleChallenges.length}`);

  return _findByCertificationCourseId({
    compatibleChallenges: flashCompatibleChallenges,
    certificationCourseId,
    certificationChallengeForScoringRepository,
    challengeRepository,
  });
};

const _findByCertificationCourseId = async ({
  compatibleChallenges,
  certificationCourseId,
  certificationChallengeForScoringRepository,
  challengeRepository,
}) => {
  const certificationChallengesForScoring = await certificationChallengeForScoringRepository.getByCertificationCourseId(
    { certificationCourseId },
  );

  const askedChallenges = await challengeRepository.getMany(
    certificationChallengesForScoring.map((challengeForScoring) => challengeForScoring.id),
  );

  _restoreCalibrationValues(certificationChallengesForScoring, askedChallenges);

  const flashCompatibleChallengesNotAskedInCertification = differenceBy(compatibleChallenges, askedChallenges, 'id');

  const allChallenges = [...askedChallenges, ...flashCompatibleChallengesNotAskedInCertification];

  debugScoringForV3Certification(
    `Challenges after FlashCompatibleChallenges & CandidateAnswers merge count: ${allChallenges.length}`,
  );

  return { allChallenges, askedChallenges, certificationChallengesForScoring };
};

function _restoreCalibrationValues(certificationChallengesForScoring, askedChallenges) {
  certificationChallengesForScoring.forEach((certificationChallengeForScoring) => {
    const askedChallenge = askedChallenges.find(({ id }) => id === certificationChallengeForScoring.id);
    askedChallenge.discriminant = certificationChallengeForScoring.discriminant;
    askedChallenge.difficulty = certificationChallengeForScoring.difficulty;
  });
}
