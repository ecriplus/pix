import { NotFoundError } from '../errors.js';
import { Assessment } from '../models/Assessment.js';

export async function getAssessment({
  assessmentId,
  locale,
  assessmentRepository,
  competenceRepository,
  courseRepository,
  certificationChallengeLiveAlertRepository,
  certificationCompanionAlertRepository,
}) {
  const assessment = await assessmentRepository.getWithAnswers(assessmentId);
  switch (assessment.type) {
    case Assessment.types.CERTIFICATION: {
      const challengeLiveAlerts = await certificationChallengeLiveAlertRepository.getByAssessmentId({
        assessmentId: assessment.id,
      });
      const companionLiveAlerts = await certificationCompanionAlertRepository.getAllByAssessmentId({
        assessmentId: assessment.id,
      });
      assessment.attachLiveAlerts({ challengeLiveAlerts, companionLiveAlerts });
      break;
    }

    case Assessment.types.COMPETENCE_EVALUATION: {
      assessment.title = await competenceRepository.getCompetenceName({ id: assessment.competenceId, locale });
      break;
    }

    case Assessment.types.DEMO: {
      const course = await courseRepository.get(assessment.courseId);
      if (!course.canBePlayed) {
        throw new NotFoundError("Le test demandé n'existe pas");
      }
      assessment.title = course.name;
      break;
    }
  }

  return assessment;
}
