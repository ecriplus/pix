export class Campaign {
  constructor({
    id,
    code,
    name,
    title,
    createdAt,
    archivedAt,
    customLandingPageText,
    isExam,
    isAssessment,
    isProfilesCollection,
    targetProfileId,
  }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.title = title;
    this.createdAt = createdAt;
    this.archivedAt = archivedAt;
    this.customLandingPageText = customLandingPageText;
    this.isExam = isExam;
    this.isAssessment = isAssessment;
    this.isProfilesCollection = isProfilesCollection;
    this.targetProfileId = targetProfileId;
  }
}
