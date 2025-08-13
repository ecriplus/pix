import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { repositories } from '../../infrastructure/repositories/index.js';

const dependencies = {
  eligibilityRepository: repositories.eligibilityRepository,
  rewardRepository: repositories.rewardRepository,
  successRepository: repositories.successRepository,
  questRepository: repositories.questRepository,
  combinedCourseParticipationRepository: repositories.combinedCourseParticipationRepository,
  combinedCourseParticipantRepository: repositories.combinedCourseParticipantRepository,
  combinedCourseRepository: repositories.combinedCourseRepository,
  moduleRepository: repositories.moduleRepository,
  recommendedModulesRepository: repositories.recommendedModulesRepository,
  campaignRepository: repositories.campaignRepository,
  userRepository: repositories.userRepository,
  logger,
};

import { checkUserQuest } from './check-user-quest-success.js';
import { createOrUpdateQuestsInBatch } from './create-or-update-quests-in-batch.js';
import { getCombinedCourseByCode } from './get-combined-course-by-code.js';
import { getQuestResultsForCampaignParticipation } from './get-quest-results-for-campaign-participation.js';
import { getVerifiedCode } from './get-verified-code.js';
import { rewardUser } from './reward-user.js';
import { startCombinedCourse } from './start-combined-course.js';
import { updateCombinedCourse } from './update-combined-course.js';

const usecasesWithoutInjectedDependencies = {
  checkUserQuest,
  createOrUpdateQuestsInBatch,
  getCombinedCourseByCode,
  getQuestResultsForCampaignParticipation,
  getVerifiedCode,
  rewardUser,
  startCombinedCourse,
  updateCombinedCourse,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
