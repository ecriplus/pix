import { ChallengeDeneutralized } from '../events/ChallengeDeneutralized.js';

const deneutralizeChallenge = async function ({
  certificationCourseId,
  challengeRecId,
  juryId,
  certificationAssessmentRepository,
}) {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });
  certificationAssessment.deneutralizeChallengeByRecId(challengeRecId);
  await certificationAssessmentRepository.save(certificationAssessment);
  return new ChallengeDeneutralized({ certificationCourseId, juryId });
};

export { deneutralizeChallenge };
