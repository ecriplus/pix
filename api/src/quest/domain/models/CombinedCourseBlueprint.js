import Joi from 'joi';

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
        : { type: COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION, value: targetProfileId },
    );
  }
}

export const COMBINED_COURSE_BLUEPRINT_ITEMS = {
  MODULE: 'module',
  EVALUATION: 'evaluation',
};

export const contentSchema = Joi.array()
  .items(
    Joi.object({
      type: Joi.string()
        .valid(COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION, COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE)
        .required(),
      value: Joi.alternatives().conditional('type', {
        switch: [
          {
            is: COMBINED_COURSE_BLUEPRINT_ITEMS.EVALUATION,
            then: Joi.number().integer().required(),
          },
          {
            is: COMBINED_COURSE_BLUEPRINT_ITEMS.MODULE,
            then: Joi.string().required(),
          },
        ],
      }),
    }),
  )
  .required()
  .strict();
