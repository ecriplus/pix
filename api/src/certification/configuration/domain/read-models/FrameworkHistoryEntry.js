export const FRAMEWORK_HISTORY_STATUSES = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
};

export class FrameworkHistoryEntry {
  constructor({ id, startDate, expirationDate, assessmentDuration, maximumAssessmentLength }) {
    this.id = id;
    this.startDate = startDate ?? null;
    this.expirationDate = expirationDate ?? null;
    this.assessmentDuration = assessmentDuration;
    this.maximumAssessmentLength = maximumAssessmentLength;
    this.status = this.#computeStatus();
  }

  #computeStatus() {
    if (this.expirationDate) return FRAMEWORK_HISTORY_STATUSES.ARCHIVED;
    if (this.startDate) return FRAMEWORK_HISTORY_STATUSES.ACTIVE;
    return FRAMEWORK_HISTORY_STATUSES.DRAFT;
  }
}
