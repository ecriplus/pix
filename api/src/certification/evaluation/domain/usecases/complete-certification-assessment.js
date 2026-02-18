import { NotFoundError } from '../../../../shared/domain/errors.js';
import { CertificationCompletedJob } from '../events/CertificationCompleted.js';

export const completeCertificationAssessment =
  /**
   * @param {object} params
   * @param {number} params.certificationCourseId
   * @param {string} params.locale
   * @param {import('./index.js').AssessmentSheetRepository} params.assessmentSheetRepository
   * @param {import('./index.js').CertificationCompletedJobRepository} params.certificationCompletedJobRepository
   **/
  async function ({ certificationCourseId, locale, assessmentSheetRepository, certificationCompletedJobRepository }) {
    const assessmentSheet = await assessmentSheetRepository.findByCertificationCourseId(certificationCourseId);

    if (!assessmentSheet) throw new NotFoundError('Assessment not found');

    if (assessmentSheet.isStarted) {
      assessmentSheet.complete();
      await assessmentSheetRepository.update(assessmentSheet);
      await certificationCompletedJobRepository.performAsync(
        new CertificationCompletedJob({
          certificationCourseId,
          locale,
        }),
      );
    }
  };
