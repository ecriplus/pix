export class Campaign {
  constructor({
    id,
    name,
    organizationId,
    organizationName,
    type,
    targetProfileId,
    targetProfileName,
    code,
    createdAt,
  }) {
    this.id = id;
    this.name = name;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.type = type;
    this.targetProfileId = targetProfileId;
    this.targetProfileName = targetProfileName;
    this.code = code;
    this.createdAt = createdAt;
  }
}
