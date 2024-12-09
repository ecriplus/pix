import { ChallengeNeutralized } from '../events/ChallengeNeutralized.js';

const neutralizeChallenge = async function ({
  certificationCourseId,
  challengeRecId,
  juryId,
  certificationAssessmentRepository,
}) {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });
  certificationAssessment.neutralizeChallengeByRecId(challengeRecId);
  await certificationAssessmentRepository.save(certificationAssessment);
  return new ChallengeNeutralized({ certificationCourseId, juryId });
};

export { neutralizeChallenge };
