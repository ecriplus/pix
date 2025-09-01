import { RecommendedModule } from '../read-models/RecommendedModule.js';
import moduleService from '../services/module-service.js';

export const findRecommendedModulesByCampaignParticipationIds = async function ({
  campaignParticipationIds,
  moduleRepository,
  userRecommendedTrainingRepository,
  logger,
}) {
  const userRecommendedTrainings = await userRecommendedTrainingRepository.findModulesByCampaignParticipationIds({
    campaignParticipationIds,
  });
  const userRecommendedModules = await Promise.all(
    userRecommendedTrainings.map(async ({ id, link }) => {
      try {
        const module = await moduleService.getModuleByLink({ link, moduleRepository });
        return { id, moduleId: module.id };
      } catch {
        logger.error({ message: `Erreur sur le lien de la ressource : ${link}` });
        return;
      }
    }),
  );

  return userRecommendedModules.filter((module) => module !== undefined).map((module) => new RecommendedModule(module));
};
