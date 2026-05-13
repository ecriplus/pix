import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { correctAnswer } from '../services/correct-answer.js';
import { initMissionActivity } from '../services/init-mission-activity.js';
import { updateAssessment } from '../services/update-assessment.js';
import { updateCurrentActivity } from '../services/update-current-activity.js';

const handleActivityAnswer = async function ({
  activityAnswer,
  assessmentId,
  examiner,
  challengeRepository,
  assessmentRepository,
  activityAnswerRepository,
  activityRepository,
  missionAssessmentRepository,
  missionRepository,
}) {
  return await DomainTransaction.execute(async () => {
    let lastActivity = await activityRepository.getLastActivity(assessmentId);

    const correctedAnswer = await correctAnswer({
      activityAnswer,
      activityId: lastActivity.id,
      assessmentId,
      challengeRepository,
      assessmentRepository,
      activityAnswerRepository,
      activityRepository,
      examiner,
    });

    lastActivity = await updateCurrentActivity({
      assessmentId,
      lastActivity,
      lastAnswer: correctedAnswer,
      activityRepository,
      missionAssessmentRepository,
      missionRepository,
    });

    lastActivity = await initMissionActivity({
      lastActivity,
      assessmentId,
      activityRepository,
      missionAssessmentRepository,
      missionRepository,
    });

    await updateAssessment({
      lastActivity,
      assessmentId,
      assessmentRepository,
      activityRepository,
      missionAssessmentRepository,
    });

    return correctedAnswer;
  });
};

export { handleActivityAnswer };
