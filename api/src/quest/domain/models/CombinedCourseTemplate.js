import Joi from 'joi';

import { EntityValidationError } from '../../../shared/domain/errors.js';
import { CombinedCourse } from './CombinedCourse.js';
import { COMPARISONS as CRITERION_PROPERTY_COMPARISONS } from './CriterionProperty.js';
import { Quest } from './Quest.js';
import { buildRequirement, COMPARISONS, TYPES } from './Requirement.js';

export class CombinedCourseTemplate {
  #quest;
  #name;
  #description;
  #illustration;

  constructor({ name, successRequirements, description, illustration }) {
    const now = new Date();
    const { successRequirements: parsedSuccessRequirements } = this.#validate({
      name,
      successRequirements,
      description,
      illustration,
    });
    this.#name = name;
    this.#quest = new Quest({
      createdAt: now,
      updatedAt: now,
      rewardType: null,
      rewardId: null,
      eligibilityRequirements: [],
      successRequirements: parsedSuccessRequirements,
    });
    this.#description = description;
    this.#illustration = illustration;
  }

  get targetProfileIds() {
    return this.#quest.successRequirements
      .filter((requirement) => requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS)
      .map(({ data }) => parseInt(data.targetProfileId.data));
  }

  get moduleIds() {
    return this.#quest.successRequirements
      .filter((requirement) => requirement.requirement_type === TYPES.OBJECT.PASSAGES)
      .map(({ data }) => data.moduleId.data);
  }

  toCombinedCourse(code, organizationId, campaigns) {
    const quest = this.toCombinedCourseQuestFormat(campaigns);
    return new CombinedCourse(
      { name: this.#name, code, organizationId, description: this.#description, illustration: this.#illustration },
      quest,
    );
  }

  toCombinedCourseQuestFormat(campaigns) {
    const successRequirements = this.#quest.successRequirements.map((requirement) => {
      if (requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS) {
        const requirementTargetProfileId = requirement.data.targetProfileId.data;
        const campaignId = campaigns.find(({ targetProfileId }) => targetProfileId === requirementTargetProfileId).id;
        return buildRequirement({
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS.ALL,
          data: {
            campaignId: { data: campaignId, comparison: CRITERION_PROPERTY_COMPARISONS.EQUAL },
            status: { data: 'SHARED', comparison: CRITERION_PROPERTY_COMPARISONS.EQUAL },
          },
        });
      } else if (requirement.requirement_type === TYPES.OBJECT.PASSAGES) {
        return buildRequirement({
          requirement_type: TYPES.OBJECT.PASSAGES,
          comparison: COMPARISONS.ALL,
          data: {
            ...requirement.data,
            isTerminated: { data: true, comparison: CRITERION_PROPERTY_COMPARISONS.EQUAL },
          },
        });
      } else {
        return requirement;
      }
    });
    return new Quest({
      ...this.#quest,
      successRequirements,
      eligibilityRequirements: [],
    });
  }

  #validate(combinedCourse) {
    const { value, error } = schema.validate(combinedCourse);
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details, undefined, { data: combinedCourse });
    }
    return value;
  }
}

const schema = Joi.object({
  name: Joi.string().required(),
  successRequirements: Joi.array()
    .items(
      Joi.object({
        requirement_type: Joi.string().valid(TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS, TYPES.OBJECT.PASSAGES).required(),
        comparison: Joi.string().valid(COMPARISONS.ALL, COMPARISONS.ONE_OF),
        data: Joi.alternatives()
          .conditional('requirement_type', {
            switch: [
              {
                is: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                then: Joi.object({
                  targetProfileId: Joi.object({
                    data: Joi.number().integer().required(),
                    comparison: Joi.string().valid(CRITERION_PROPERTY_COMPARISONS.EQUAL).required(),
                  }).required(),
                }).required(),
              },
              {
                is: TYPES.OBJECT.PASSAGES,
                then: Joi.object({
                  moduleId: Joi.object({
                    data: Joi.string().required(),
                    comparison: Joi.string().valid(CRITERION_PROPERTY_COMPARISONS.EQUAL).required(),
                  }).required(),
                }).required(),
              },
            ],
          })
          .required(),
      }),
    )
    .required(),
  illustration: Joi.string().allow(null),
  description: Joi.string().allow(null),
}).strict();
