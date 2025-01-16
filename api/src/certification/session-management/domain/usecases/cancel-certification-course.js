/**
 * @typedef {import('./index.js'.CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('./index.js'.SessionRepository} SessionRepository
 */

import CertificationCancelled from '../../../../../src/shared/domain/events/CertificationCancelled.js';
import { SessionAlreadyFinalizedError } from '../errors.js';

/**
 * @param {Object} params
 * @param {number} params.certificationCourseId
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {SessionRepository} params.sessionRepository
 * @returns {Promise<CertificationCancelled>}
 */
export const cancelCertificationCourse = async function ({
  certificationCourseId,
  juryId,
  certificationCourseRepository,
  sessionRepository,
}) {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });
  const session = await sessionRepository.get({ id: certificationCourse.id });

  if (session.isFinalized) {
    throw new SessionAlreadyFinalizedError();
  }

  certificationCourse.cancel();
  await certificationCourseRepository.update({ certificationCourse });

  return new CertificationCancelled({ certificationCourseId: certificationCourse.getId(), juryId });
};
