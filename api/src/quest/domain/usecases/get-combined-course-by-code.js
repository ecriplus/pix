import { NotFoundError } from '../../../shared/domain/errors.js';
import { CombinedCourseDetails } from '../models/CombinedCourse.js';

export async function getCombinedCourseByCode({
  userId,
  code,
  combinedCourseParticipationRepository,
  combinedCourseRepository,
  campaignRepository,
  questRepository,
  moduleRepository,
}) {
  const quest = await questRepository.getByCode({ code });
  const combinedCourse = await combinedCourseRepository.getByCode({ code });

  let participation = null;
  try {
    participation = await combinedCourseParticipationRepository.getByUserId({ questId: quest.id, userId });
  } catch (err) {
    if ((!err) instanceof NotFoundError) {
      throw err;
    }
  }

  const combinedCourseDetails = new CombinedCourseDetails(combinedCourse, quest, participation);

  const campaignIds = combinedCourseDetails.campaignIds;
  const campaigns = [];
  for (const campaignId of campaignIds) {
    const campaign = await campaignRepository.get({ id: campaignId });
    campaigns.push(campaign);
  }

  const moduleIds = combinedCourseDetails.moduleIds;

  const modules = await moduleRepository.getByUserIdAndModuleIds({ userId, moduleIds });

  combinedCourseDetails.generateItems([...campaigns, ...modules]);

  return combinedCourseDetails;
}
