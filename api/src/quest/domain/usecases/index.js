import * as organizationLearnerPrescriptionRepository from '../../../prescription/organization-learner/infrastructure/repositories/organization-learner-repository.js';
import * as codeGenerator from '../../../shared/domain/services/code-generator.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { logger } from '../../../shared/infrastructure/utils/logger.js';
import { repositories } from '../../infrastructure/repositories/index.js';
import * as organizationLearnerRepository from '../../infrastructure/repositories/organization-learner-repository.js';
import combinedCourseDetailsService from '../services/combined-course-details-service.js';

const { combinedCourseDetailsService: injectedCombinedCourseDetailsService } = injectDependencies(
  { combinedCourseDetailsService },
  {
    combinedCourseParticipationRepository: repositories.combinedCourseParticipationRepository,
    combinedCourseRepository: repositories.combinedCourseRepository,
    campaignRepository: repositories.campaignRepository,
    questRepository: repositories.questRepository,
    moduleRepository: repositories.moduleRepository,
    eligibilityRepository: repositories.eligibilityRepository,
    recommendedModuleRepository: repositories.recommendedModuleRepository,
  },
);

const dependencies = {
  accessCodeRepository: repositories.accessCodeRepository,
  eligibilityRepository: repositories.eligibilityRepository,
  rewardRepository: repositories.rewardRepository,
  successRepository: repositories.successRepository,
  questRepository: repositories.questRepository,
  combinedCourseParticipationRepository: repositories.combinedCourseParticipationRepository,
  combinedCourseParticipantRepository: repositories.combinedCourseParticipantRepository,
  combinedCourseRepository: repositories.combinedCourseRepository,
  moduleRepository: repositories.moduleRepository,
  recommendedModuleRepository: repositories.recommendedModuleRepository,
  campaignRepository: repositories.campaignRepository,
  userRepository: repositories.userRepository,
  targetProfileRepository: repositories.targetProfileRepository,
  organizationLearnerParticipationRepository: repositories.organizationLearnerParticipationRepository,
  combinedCourseDetailsService: injectedCombinedCourseDetailsService,
  organizationLearnerRepository,
  organizationLearnerPrescriptionRepository,
  combinedCourseBlueprintRepository: repositories.combinedCourseBlueprintRepository,
  codeGenerator,
  logger,
};

import { checkUserQuest } from './check-user-quest-success.js';
import { createCombinedCourses } from './create-combined-courses.js';
import { createOrUpdateQuestsInBatch } from './create-or-update-quests-in-batch.js';
import { findCombinedCourseBlueprints } from './find-combined-course-blueprints.js';
import { findCombinedCourseByCampaignId } from './find-combined-course-by-campaign-id.js';
import { findCombinedCourseByModuleIdAndUserId } from './find-combined-course-by-moduleId-and-user-id.js';
import { findCombinedCourseParticipations } from './find-combined-course-participations.js';
import { getCombinedCourseByCode } from './get-combined-course-by-code.js';
import getCombinedCourseById from './get-combined-course-by-id.js';
import { getCombinedCourseParticipationById } from './get-combined-course-participation-by-id.js';
import { getCombinedCourseStatistics } from './get-combined-course-statistics.js';
import getCombinedCoursesByOrganizationId from './get-combined-courses-by-organization-id.js';
import { getQuestResultsForCampaignParticipation } from './get-quest-results-for-campaign-participation.js';
import { getVerifiedCode } from './get-verified-code.js';
import { rewardUser } from './reward-user.js';
import { startCombinedCourse } from './start-combined-course.js';
import { updateCombinedCourse } from './update-combined-course.js';

const usecasesWithoutInjectedDependencies = {
  checkUserQuest,
  createOrUpdateQuestsInBatch,
  findCombinedCourseByCampaignId,
  findCombinedCourseByModuleIdAndUserId,
  getCombinedCourseByCode,
  getCombinedCourseStatistics,
  getCombinedCourseById,
  getCombinedCourseParticipationById,
  findCombinedCourseParticipations,
  findCombinedCourseBlueprints,
  getCombinedCoursesByOrganizationId,
  getQuestResultsForCampaignParticipation,
  getVerifiedCode,
  rewardUser,
  startCombinedCourse,
  updateCombinedCourse,
  createCombinedCourses,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
