import { DomainError } from '../../../shared/domain/errors.js';
import { usecases } from '../../domain/usecases/index.js';
import { RecommendedModule } from './models/RecommendedModule.js';

const findByCampaignParticipationIds = async ({ campaignParticipationIds }) => {
  if (campaignParticipationIds.length === 0) {
    throw new DomainError('campaignParticipationIds can not be empty');
  }

  const recommendedModules = await usecases.findRecommendedModulesByCampaignParticipationIds({
    campaignParticipationIds,
  });

  return recommendedModules.map((module) => new RecommendedModule(module));
};

export { findByCampaignParticipationIds };
