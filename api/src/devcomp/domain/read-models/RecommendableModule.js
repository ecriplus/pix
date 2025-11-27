import { RecommendedModule } from './RecommendedModule.js';

class RecommendableModule extends RecommendedModule {
  constructor({ id, moduleId, shortId, targetProfileIds } = {}) {
    super({ id, moduleId, shortId });
    this.targetProfileIds = targetProfileIds;
  }
}

export { RecommendableModule };
