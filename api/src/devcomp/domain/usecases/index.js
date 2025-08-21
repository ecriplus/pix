import * as userRepository from '../../../identity-access-management/infrastructure/repositories/user.repository.js';
import * as llmApi from '../../../llm/application/api/llm-api.js';
import * as campaignRepository from '../../../prescription/campaign/infrastructure/repositories/campaign-repository.js';
import * as campaignParticipationRepository from '../../../prescription/campaign-participation/infrastructure/repositories/campaign-participation-repository.js';
import * as targetProfileRepository from '../../../prescription/target-profile/infrastructure/repositories/target-profile-repository.js';
import * as targetProfileSummaryForAdminRepository from '../../../prescription/target-profile/infrastructure/repositories/target-profile-summary-for-admin-repository.js';
import * as knowledgeElementRepository from '../../../shared/infrastructure/repositories/knowledge-element-repository.js';
import * as organizationRepository from '../../../shared/infrastructure/repositories/organization-repository.js';
import * as skillRepository from '../../../shared/infrastructure/repositories/skill-repository.js';
import * as tubeRepository from '../../../shared/infrastructure/repositories/tube-repository.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { repositories } from '../../infrastructure/repositories/index.js';
import * as targetProfileTrainingOrganizationRepository from '../../infrastructure/repositories/target-profile-training-organization-repository.js';
import * as targetProfileTrainingRepository from '../../infrastructure/repositories/target-profile-training-repository.js';

const dependencies = {
  ...repositories,
  campaignRepository,
  campaignParticipationRepository,
  knowledgeElementRepository,
  organizationRepository,
  targetProfileRepository,
  targetProfileSummaryForAdminRepository,
  tubeRepository,
  targetProfileTrainingRepository,
  targetProfileTrainingOrganizationRepository,
  skillRepository,
  userRepository,
  llmApi,
};

import { addTutorialEvaluation } from './add-tutorial-evaluation.js';
import { addTutorialToUser } from './add-tutorial-to-user.js';
import { attachTargetProfilesToTraining } from './attach-target-profiles-to-training.js';
import { createOrUpdateTrainingTrigger } from './create-or-update-training-trigger.js';
import { createPassage } from './create-passage.js';
import { createTraining } from './create-training.js';
import { detachTargetProfilesFromTraining } from './detach-target-profiles-from-training.js';
import { duplicateTraining } from './duplicate-training.js';
import { findCampaignParticipationTrainings } from './find-campaign-participation-trainings.js';
import { findPaginatedFilteredOrganizations } from './find-paginated-filtered-organizations.js';
import { findPaginatedFilteredTutorials } from './find-paginated-filtered-tutorials.js';
import { findPaginatedTargetProfileTrainingSummaries } from './find-paginated-target-profile-training-summaries.js';
import { findPaginatedTrainingSummaries } from './find-paginated-training-summaries.js';
import { findPaginatedUserRecommendedTrainings } from './find-paginated-user-recommended-trainings.js';
import { findRecommendedModulesByCampaignParticipationIds } from './find-recommended-modules-by-campaign-participation-ids.js';
import { findRecommendedModulesByTargetProfileIds } from './find-recommended-modules-by-target-profile-ids.js';
import { findTargetProfileSummariesForTraining } from './find-target-profile-summaries-for-training.js';
import { findTutorials } from './find-tutorials.js';
import { getModule } from './get-module.js';
import { getModuleMetadataList } from './get-module-metadata-list.js';
import { getTraining } from './get-training.js';
import { getUserModuleStatuses } from './get-user-module-statuses.js';
import { handleTrainingRecommendation } from './handle-training-recommendation.js';
import { promptToLLMChat } from './prompt-to-llm-chat.js';
import { recordPassageEvents } from './record-passage-events.js';
import { startEmbedLlmChat } from './start-embed-llm-chat.js';
import { terminatePassage } from './terminate-passage.js';
import { updateTraining } from './update-training.js';
import { verifyAndSaveAnswer } from './verify-and-save-answer.js';

const usecasesWithoutInjectedDependencies = {
  addTutorialEvaluation,
  addTutorialToUser,
  attachTargetProfilesToTraining,
  createOrUpdateTrainingTrigger,
  createPassage,
  createTraining,
  detachTargetProfilesFromTraining,
  duplicateTraining,
  findCampaignParticipationTrainings,
  findPaginatedFilteredOrganizations,
  findPaginatedFilteredTutorials,
  findPaginatedTargetProfileTrainingSummaries,
  findPaginatedTrainingSummaries,
  findPaginatedUserRecommendedTrainings,
  findRecommendedModulesByCampaignParticipationIds,
  findRecommendedModulesByTargetProfileIds,
  findTargetProfileSummariesForTraining,
  findTutorials,
  getModuleMetadataList,
  getModule,
  getTraining,
  getUserModuleStatuses,
  handleTrainingRecommendation,
  promptToLLMChat,
  recordPassageEvents,
  startEmbedLlmChat,
  terminatePassage,
  updateTraining,
  verifyAndSaveAnswer,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
