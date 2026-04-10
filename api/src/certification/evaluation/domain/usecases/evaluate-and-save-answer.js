import { NotFoundError } from '../../../../shared/domain/errors.js';

export async function evaluateAndSaveAnswer({
  answer,
  userId,
  certificationCourseId,
  forceOKAnswer,
  assessmentSheetRepository,
}) {
  const assessmentSheet = await assessmentSheetRepository.findByCertificationCourseId(certificationCourseId);
  if (!assessmentSheet) {
    throw new NotFoundError(`No certification test found with id ${certificationCourseId}`);
  }

  return 'coucou';
}
