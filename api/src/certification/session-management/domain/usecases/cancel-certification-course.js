/**
 * @typedef {import('./index.js'.CertificationCourseRepository} CertificationCourseRepository
 */

import CertificationCancelled from '../../../../../src/shared/domain/events/CertificationCancelled.js';

/**
 * @param {Object} params
 * @param {number} params.certificationCourseId
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @returns {Promise<CertificationCancelled>}
 */
export const cancelCertificationCourse = async function ({
  certificationCourseId,
  juryId,
  certificationCourseRepository,
}) {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });
  certificationCourse.cancel();
  await certificationCourseRepository.update({ certificationCourse });

  return new CertificationCancelled({ certificationCourseId: certificationCourse.getId(), juryId });
};
