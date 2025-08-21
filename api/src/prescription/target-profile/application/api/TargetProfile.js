export class TargetProfile {
  constructor({ id, name, internalName, category, isSimplifiedAccess }) {
    this.id = id;
    this.name = name;
    this.internalName = internalName;
    this.category = category;
    this.isSimplifiedAccess = isSimplifiedAccess;
  }
}
