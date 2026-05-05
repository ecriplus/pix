/**
 * @typedef {import ('../../domain/events/ChallengeDeneutralized.js').ChallengeDeneutralized} ChallengeDeneutralized
 * @typedef {import ('../../domain/events/ChallengeNeutralized.js').ChallengeNeutralized} ChallengeNeutralized
 * @typedef {import ('../../domain/events/CertificationJuryDone.js').CertificationJuryDone} CertificationJuryDone
 * @typedef {import ('../../domain/events/CertificationCourseRejected.js').CertificationCourseRejected} CertificationCourseRejected
 * @typedef {import ('../../domain/events/CertificationCourseUnrejected.js').CertificationCourseUnrejected} CertificationCourseUnrejected
 * @typedef {import ('../../domain/events/CertificationCancelled.js').CertificationCancelled} CertificationCancelled
 * @typedef {import ('../../domain/events/CertificationRescored.js').CertificationRescored} CertificationRescored
 * @typedef {import ('../../domain/events/CertificationUncancelled.js').CertificationUncancelled} CertificationUncancelled
 * @typedef {import ('../../../../shared/domain/errors.js').AssessmentEndedError} AssessmentEndedError
 * @typedef {import ('../../../../shared/domain/errors.js').AssessmentLackOfChallengesError} AssessmentLackOfChallengesError
 * @typedef {import ('../../../../shared/domain/models/Challenge.js').Challenge} Challenge
 */
import { getRequestId } from '../../../../shared/infrastructure/execution-context-manager.js';
import { redisMutex } from '../../../../shared/infrastructure/mutex/RedisMutex.js';
import { NextChallengeAlreadyComputingError } from '../../domain/errors.js';
import { usecases } from '../../domain/usecases/index.js';

/**
 * @function
 * @name rescoreV3Certification
 *
 * @param {object} params
 * @param {CertificationJuryDone|CertificationCourseRejected|CertificationCourseUnrejected|CertificationCancelled|CertificationRescored|CertificationUncancelled} params.event
 *
 * @returns {Promise<void>}
 */
export async function rescoreV3Certification({ event }) {
  return usecases.scoreV3Certification({ certificationCourseId: event.certificationCourseId, event });
}
/**
 * @function
 * @name rescoreV2Certification
 *
 * @param {object} params
 * @param {ChallengeNeutralized|ChallengeDeneutralized|CertificationJuryDone|CertificationCourseRejected|CertificationCourseUnrejected|CertificationCancelled|CertificationRescored|CertificationUncancelled} params.event
 *
 * @returns {Promise<void>}
 */
export async function rescoreV2Certification({ event }) {
  return usecases.rescoreV2Certification({ event });
}

/**
 * @function
 * @name selectNextCertificationChallenge
 *
 * @param {object} params
 * @param {number} params.assessmentId
 *
 * @returns {Promise<string>} next challenge id
 * @throws {AssessmentEndedError} test ended or no next challenge available
 * @throws {AssessmentLackOfChallengesError} no eligible challenges remaining before reaching maximum assessment length
 */
export async function selectNextCertificationChallenge({ assessmentId }) {
  const owner = getRequestId();
  const locked = await redisMutex.lock(assessmentId.toString(), owner);
  if (!locked) {
    throw new NextChallengeAlreadyComputingError();
  }
  try {
    return await usecases.getNextChallenge({ assessmentId });
  } finally {
    await redisMutex.release(assessmentId.toString(), owner);
  }
}

/**
 * @function
 * @name evaluateAndSaveAnswer
 *
 * @param {object} params
 * @param {Answer} params.answer
 * @param {number} params.userId
 * @param {number} params.certificationCourseId
 * @param {boolean} params.forceOKAnswer
 *
 * @returns {Promise<Answer>} evaluated answer
 */
export async function evaluateAndSaveAnswer({ answer, userId, certificationCourseId, forceOKAnswer }) {
  return usecases.evaluateAndSaveAnswer({ answer, userId, certificationCourseId, forceOKAnswer });
}

/**
 * @function
 * @name completeCertificationAssessment
 *
 * @param {object} params
 * @param {number} params.certificationCourseId
 * @param {string} params.locale
 *
 * @returns {Promise<void>}
 */
export async function completeCertificationAssessment({ certificationCourseId, locale }) {
  return usecases.completeCertificationAssessment({ certificationCourseId, locale });
}
