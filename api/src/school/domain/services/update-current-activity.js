import { Activity } from '../models/Activity.js';
import { ActivityInfo } from '../models/ActivityInfo.js';

export async function updateCurrentActivity({
  assessmentId,
  activityRepository,
  activityAnswerRepository,
  missionAssessmentRepository,
  missionRepository,
}) {
  const lastActivity = await activityRepository.getLastActivity(assessmentId);
  const lastAnswer = await activityAnswerRepository.findLastByActivity(lastActivity.id);

  if (lastAnswer.result.isOK() || lastActivity.isTutorial) {
    const { missionId } = await missionAssessmentRepository.getByAssessmentId(assessmentId);
    const mission = await missionRepository.get(missionId);
    if (_isActivityFinished(mission, lastActivity, lastAnswer)) {
      return activityRepository.updateStatus({ activityId: lastActivity.id, status: Activity.status.SUCCEEDED });
    }
    return lastActivity;
  }
  if (lastAnswer.result.isKO()) {
    return activityRepository.updateStatus({ activityId: lastActivity.id, status: Activity.status.FAILED });
  }
  return activityRepository.updateStatus({ activityId: lastActivity.id, status: Activity.status.SKIPPED });
}

function _isActivityFinished(mission, lastActivity, lastAnswer) {
  const lastChallengeIds = mission.getLastChallengeIds(new ActivityInfo(lastActivity));
  return lastChallengeIds.includes(lastAnswer.challengeId);
}
