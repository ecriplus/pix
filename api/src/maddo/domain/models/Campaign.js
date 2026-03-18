export class Campaign {
  constructor({ id, name, type, targetProfileName, code, archivedAt, createdAt, tubes }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.targetProfileName = targetProfileName;
    this.code = code;
    this.createdAt = createdAt;
    this.archivedAt = archivedAt;
    this.tubes = tubes;
  }
}
