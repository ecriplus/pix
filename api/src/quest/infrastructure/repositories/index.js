import * as modulesApi from '../../../devcomp/application/api/modules-api.js';
import * as recommendedModulesApi from '../../../devcomp/application/api/recommended-modules-api.js';
import * as knowledgeElementsApi from '../../../evaluation/application/api/knowledge-elements-api.js';
import * as userApi from '../../../identity-access-management/application/api/users-api.js';
import * as skillsApi from '../../../learning-content/application/api/skills-api.js';
import * as campaignsApi from '../../../prescription/campaign/application/api/campaigns-api.js';
import * as organizationLearnerApi from '../../../prescription/organization-learner/application/api/organization-learners-api.js';
import * as organizationLearnerWithParticipationApi from '../../../prescription/organization-learner/application/api/organization-learners-with-participations-api.js';
import * as targetProfilesApi from '../../../prescription/target-profile/application/api/target-profile-api.js';
import * as profileRewardApi from '../../../profile/application/api/profile-reward-api.js';
import * as rewardApi from '../../../profile/application/api/reward-api.js';
import { temporaryStorage } from '../../../shared/infrastructure/key-value-storages/index.js';
import * as accessCodeRepository from '../../../shared/infrastructure/repositories/access-code-repository.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import * as campaignRepository from './campaign-repository.js';
import * as combinedCourseParticipantRepository from './combined-course-participant-repository.js';
import * as combinedCourseParticipationRepository from './combined-course-participation-repository.js';
import * as combinedCourseRepository from './combined-course-repository.js';
import * as eligibilityRepository from './eligibility-repository.js';
import * as moduleRepository from './module-repository.js';
import * as organizationLearnerPassageParticipationRepository from './organization-learner-passage-participation-repository.js';
import * as questRepository from './quest-repository.js';
import * as recommendedModulesRepository from './recommended-module-repository.js';
import * as rewardRepository from './reward-repository.js';
import * as successRepository from './success-repository.js';
import * as targetProfileRepository from './target-profile-repository.js';
import * as userRepository from './user-repository.js';

const profileRewardTemporaryStorage = temporaryStorage.withPrefix('profile-rewards:');

const repositoriesWithoutInjectedDependencies = {
  accessCodeRepository,
  eligibilityRepository,
  organizationLearnerPassageParticipationRepository,
  moduleRepository,
  successRepository,
  rewardRepository,
  questRepository,
  campaignRepository,
  combinedCourseRepository,
  combinedCourseParticipantRepository,
  combinedCourseParticipationRepository,
  userRepository,
  recommendedModulesRepository,
  targetProfileRepository,
};

const dependencies = {
  organizationLearnerWithParticipationApi,
  knowledgeElementsApi,
  campaignsApi,
  organizationLearnerApi,
  skillsApi,
  profileRewardApi,
  modulesApi,
  targetProfilesApi,
  profileRewardTemporaryStorage,
  rewardApi,
  userApi,
  recommendedModulesApi,
};

const repositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { repositories };
