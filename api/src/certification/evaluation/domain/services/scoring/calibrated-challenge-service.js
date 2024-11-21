import Debug from 'debug';
import differenceBy from 'lodash/differenceBy.js';

const debugScoringForV3Certification = Debug('pix:certif:v3:scoring');

export const findByCertificationCourseId = async ({
  certificationCourseId,
  certificationChallengeRepository,
  challengeRepository,
}) => {
  const flashCompatibleChallenges = await challengeRepository.findFlashCompatibleWithoutLocale({
    useObsoleteChallenges: true,
  });
  debugScoringForV3Certification(`FlashCompatibleChallenges count: ${flashCompatibleChallenges.length}`);

  return _findByCertificationCourseId({
    compatibleChallenges: flashCompatibleChallenges,
    certificationCourseId,
    certificationChallengeRepository,
    challengeRepository,
  });
};

const _findByCertificationCourseId = async ({
  compatibleChallenges,
  certificationCourseId,
  certificationChallengeRepository,
  challengeRepository,
}) => {
  const challengeCalibrations = await certificationChallengeRepository.getByCertificationCourseId({
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

function _restoreCalibrationValues(challengeCalibrations, askedChallenges) {
  challengeCalibrations.forEach((certificationChallenge) => {
    const askedChallenge = askedChallenges.find(({ id }) => id === certificationChallenge.id);
    askedChallenge.discriminant = certificationChallenge.discriminant;
    askedChallenge.difficulty = certificationChallenge.difficulty;
  });
}
