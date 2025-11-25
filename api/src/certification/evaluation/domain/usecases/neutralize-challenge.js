/**
 * @typedef {import('../../../shared/infrastructure/repositories/certification-assessment-repository.js')} CertificationAssessmentRepository
 * @typedef {import('../events/ChallengeNeutralized.js').ChallengeNeutralized} ChallengeNeutralizedEvent
 */
import { ChallengeNeutralized } from '../events/ChallengeNeutralized.js';

/**
 * @param {Object} params
 * @param {string} params.certificationCourseId
 * @param {string} params.challengeRecId
 * @param {string} params.juryId
 * @param {CertificationAssessmentRepository} params.certificationAssessmentRepository
 * @returns {Promise<ChallengeNeutralizedEvent>}
 */
export const neutralizeChallenge = async function ({
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
