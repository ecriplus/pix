import * as competenceEvaluationRepository from '../../../evaluation/infrastructure/repositories/competence-evaluation-repository.js';
import { repositories } from '../../../profile/infrastructure/repositories/index.js';
import * as profileRewardRepository from '../../../profile/infrastructure/repositories/profile-reward-repository.js';
import * as areaRepository from '../../../shared/infrastructure/repositories/area-repository.js';
import * as competenceRepository from '../../../shared/infrastructure/repositories/competence-repository.js';
import * as knowledgeElementRepository from '../../../shared/infrastructure/repositories/knowledge-element-repository.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { PromiseUtils } from '../../../shared/infrastructure/utils/promise-utils.js';
import * as stringUtils from '../../../shared/infrastructure/utils/string-utils.js';
import * as attestationRepository from '../../infrastructure/repositories/attestation-repository.js';
import * as campaignParticipationRepository from '../../infrastructure/repositories/campaign-participation-repository.js';
import * as organizationProfileRewardRepository from '../../infrastructure/repositories/organizations-profile-reward-repository.js';
import * as rewardRepository from '../../infrastructure/repositories/reward-repository.js';

const dependencies = {
  competenceRepository,
  areaRepository,
  competenceEvaluationRepository,
  knowledgeElementRepository,
  profileRewardRepository,
  userRepository: repositories.userRepository,
  organizationProfileRewardRepository,
  attestationRepository,
  rewardRepository,
  campaignParticipationRepository,
  stringUtils,
  PromiseUtils,
};

import { getAttestationDataForUsers } from './get-attestation-data-for-users.js';
import { getAttestationDetails } from './get-attestation-details.js';
import { getProfileRewardsByUserId } from './get-profile-rewards-by-user-id.js';
import { getRewardByIdAndType } from './get-reward-by-id-and-type.js';
import { getSharedAttestationsForOrganizationByUserIds } from './get-shared-attestations-for-organization-by-user-ids.js';
import { getSharedAttestationsUserDetailForOrganizationByUserIds } from './get-shared-attestations-user-detail-for-organization-by-user-ids.js';
import { getUserProfile } from './get-user-profile.js';
import { rewardUser } from './reward-user.js';
import { shareProfileReward } from './share-profile-reward.js';

const usecasesWithoutInjectedDependencies = {
  getAttestationDataForUsers,
  getAttestationDetails,
  getProfileRewardsByUserId,
  getRewardByIdAndType,
  getSharedAttestationsForOrganizationByUserIds,
  getSharedAttestationsUserDetailForOrganizationByUserIds,
  getUserProfile,
  rewardUser,
  shareProfileReward,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
