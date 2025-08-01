import { DomainError } from '../../../shared/domain/errors.js';
import { usecases } from '../../domain/usecases/index.js';
import { RecommendedModule } from './models/RecommendedModule.js';
import { UserRecommendedModule } from './models/UserRecommendedModule.js';

const findByCampaignParticipationIds = async ({ campaignParticipationIds }) => {
  if (campaignParticipationIds.length === 0) {
    throw new DomainError('campaignParticipationIds can not be empty');
  }

  const recommendedModules = await usecases.findRecommendedModulesByCampaignParticipationIds({
    campaignParticipationIds,
  });

  return recommendedModules.map((recommendedModule) => new UserRecommendedModule(recommendedModule));
};

const findByTargetProfileIds = async ({ targetProfileIds }) => {
  if (targetProfileIds.length === 0) {
    throw new DomainError('targetProfileIds can not be empty');
  }

  const recommendedModules = await usecases.findRecommendedModulesByTargetProfileIds({
    targetProfileIds,
  });

  return recommendedModules.map((recommendedModule) => new RecommendedModule(recommendedModule));
};

export { findByCampaignParticipationIds, findByTargetProfileIds };
