import { RecommendedModule } from './RecommendedModule.js';

class RecommendableModule extends RecommendedModule {
  constructor({ id, moduleId, targetProfileIds } = {}) {
    super({ id, moduleId });
    this.targetProfileIds = targetProfileIds;
  }
}

export { RecommendableModule };
