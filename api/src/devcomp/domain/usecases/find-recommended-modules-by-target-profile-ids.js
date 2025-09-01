import { RecommendedModule } from '../read-models/RecommendedModule.js';
import moduleService from '../services/module-service.js';

const findRecommendedModulesByTargetProfileIds = async function ({
  targetProfileIds,
  trainingRepository,
  moduleRepository,
  logger,
}) {
  const recommendedTrainings = await trainingRepository.findModulesByTargetProfileIds({ targetProfileIds });

  const recommendedModules = await Promise.all(
    recommendedTrainings.map(async ({ id, link, targetProfileIds }) => {
      try {
        const module = await moduleService.getModuleByLink({ link, moduleRepository });
        return { id, moduleId: module.id, targetProfileIds };
      } catch {
        logger.error({ message: `Erreur sur le lien de la ressource : ${link}` });
        return;
      }
    }),
  );

  return recommendedModules.filter((module) => module !== undefined).map((module) => new RecommendedModule(module));
};

export { findRecommendedModulesByTargetProfileIds };
