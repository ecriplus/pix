export class Campaign {
  constructor({
    id,
    name,
    code,
    targetProfileId,
    organizationId,
    creatorId,
    ownerId,
    type,
    title,
    multipleSendings,
    customResultPageButtonUrl,
    customResultPageButtonText,
  }) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.targetProfileId = targetProfileId;
    this.organizationId = organizationId;
    this.creatorId = creatorId;
    this.ownerId = ownerId;
    this.type = type;
    this.multipleSendings = multipleSendings;
    this.title = title;
    this.customResultPageButtonUrl = customResultPageButtonUrl;
    this.customResultPageButtonText = customResultPageButtonText;
  }
}
