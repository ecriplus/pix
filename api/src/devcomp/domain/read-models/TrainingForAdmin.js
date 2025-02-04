class TrainingForAdmin {
  constructor({
    id,
    title,
    internalTitle,
    link,
    type,
    duration,
    locale,
    targetProfileIds,
    editorName,
    editorLogoUrl,
    trainingTriggers,
    isDisabled,
  } = {}) {
    this.id = id;
    this.title = title;
    this.internalTitle = internalTitle;
    this.link = link;
    this.type = type;
    this.duration = { ...duration }; // Prevent use of PostgresInterval object
    this.locale = locale;
    this.targetProfileIds = targetProfileIds;
    this.editorName = editorName;
    this.editorLogoUrl = editorLogoUrl;
    this.trainingTriggers = trainingTriggers;
    this.isDisabled = isDisabled;
  }

  get isRecommendable() {
    return this.trainingTriggers?.length > 0;
  }
}

export { TrainingForAdmin };
