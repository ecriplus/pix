/**
 * @typedef {import('./index.js'.CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('./index.js'.SessionRepository} SessionRepository
 */

import CertificationCancelled from '../../../../../src/shared/domain/events/CertificationCancelled.js';
import { NotFinalizedSessionError } from '../../../../shared/domain/errors.js';

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
  const session = await sessionRepository.get({ id: certificationCourse.getSessionId() });
  if (!session.isFinalized) {
    throw new NotFinalizedSessionError();
  }

  certificationCourse.cancel();
  await certificationCourseRepository.update({ certificationCourse });

  return new CertificationCancelled({ certificationCourseId: certificationCourse.getId(), juryId });
};
