class RecommendedModule {
  constructor({ id, moduleId, targetProfileIds } = {}) {
    this.id = id;
    this.moduleId = moduleId;
    this.targetProfileIds = targetProfileIds;
  }
}

export { RecommendedModule };
