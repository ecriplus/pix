export class CombinedCourseBlueprint {
  constructor({ id, name, internalName, description, illustration, content, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.internalName = internalName;
    this.description = description;
    this.illustration = illustration;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static buildContentItems(items) {
    return items.map(({ moduleId, targetProfileId }) =>
      moduleId
        ? { type: COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE, value: moduleId }
        : { type: COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUTION, value: targetProfileId },
    );
  }
}

export const COMBINED_COURSE_BLUEPRINT_ITEMS = {
  MODULE: 'module',
  EVALUTION: 'evaluation',
};
