import { Assessment } from '../models/Assessment.js';

export async function getAssessment({
  assessmentId,
  assessmentRepository,
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
  }

  return assessment;
}
