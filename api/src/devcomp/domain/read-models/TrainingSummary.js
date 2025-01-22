class TrainingSummary {
  constructor({
    id,
    title,
    internalTitle,
    prerequisiteThreshold,
    goalThreshold,
    targetProfilesCount,
    isDisabled,
  } = {}) {
    this.id = id;
    this.title = title;
    this.internalTitle = internalTitle;
    this.prerequisiteThreshold = prerequisiteThreshold;
    this.goalThreshold = goalThreshold;
    this.targetProfilesCount = targetProfilesCount;
    this.isDisabled = isDisabled;
  }
}

export { TrainingSummary };
