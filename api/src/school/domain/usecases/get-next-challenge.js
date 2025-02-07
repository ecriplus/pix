import { Activity } from '../models/Activity.js';
import { ActivityInfo } from '../models/ActivityInfo.js';

export async function getNextChallenge({
  assessmentId,
  assessmentRepository,
  activityAnswerRepository,
  challengeRepository,
  activityRepository,
  missionAssessmentRepository,
  missionRepository,
}) {
  const activity = await activityRepository.getLastActivity(assessmentId);
  if (activity.status !== Activity.status.STARTED) {
    return null;
  }
  const { missionId } = await missionAssessmentRepository.getByAssessmentId(assessmentId);
  const mission = await missionRepository.get(missionId);
  const answers = await activityAnswerRepository.findByActivity(activity.id);

  const activityInfo = new ActivityInfo({ level: activity.level, stepIndex: activity.stepIndex });
  const previousChallengeIndex = mission.getChallengeIndex(activityInfo, answers.at(-1).challengeId);
  const challengeId = mission.getChallengeId({
    activityInfo,
    challengeIndex: previousChallengeIndex + 1,
    alternativeVersion: activity.alternativeVersion,
  });

  await assessmentRepository.updateWhenNewChallengeIsAsked({ id: assessmentId, lastChallengeId: challengeId });
  return challengeRepository.get(challengeId);
}
