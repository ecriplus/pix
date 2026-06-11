class TrainingForAdmin {
  constructor({
    id,
    title,
    internalTitle,
    link,
    type,
    duration,
    locales,
    targetProfileIds,
    editorName,
    editorLogoUrl,
    trainingTriggers,
    isDisabled,
    deliveryMode,
    registrationRequired,
    program,
    objectives,
    description,
  } = {}) {
    this.id = id;
    this.title = title;
    this.internalTitle = internalTitle;
    this.link = link;
    this.type = type;
    this.duration = { ...duration }; // Prevent use of PostgresInterval object
    this.locales = locales;
    this.targetProfileIds = targetProfileIds;
    this.editorName = editorName;
    this.editorLogoUrl = editorLogoUrl;
    this.trainingTriggers = trainingTriggers;
    this.isDisabled = isDisabled;
    this.deliveryMode = deliveryMode;
    this.registrationRequired = registrationRequired;
    this.program = program;
    this.objectives = objectives;
    this.description = description;
  }

  get isRecommendable() {
    return this.trainingTriggers?.length > 0;
  }
}

export { TrainingForAdmin };
