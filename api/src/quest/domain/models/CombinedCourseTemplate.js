import Joi from 'joi';

import { CampaignParticipationStatuses } from '../../../prescription/shared/domain/constants.js';
import { EntityValidationError } from '../../../shared/domain/errors.js';
import { CombinedCourse } from './CombinedCourse.js';
import { COMPARISONS as CRITERION_PROPERTY_COMPARISONS } from './CriterionProperty.js';
import { Quest } from './Quest.js';
import { buildRequirement, COMPARISONS, TYPES } from './Requirement.js';

export class CombinedCourseTemplate {
  #content;
  #now;
  #name;
  #description;
  #illustration;

  constructor({ name, combinedCourseContent, description, illustration }) {
    this.#validate({
      name,
      combinedCourseContent,
      description,
      illustration,
    });
    this.#now = new Date();
    this.#name = name;
    this.#content = combinedCourseContent;
    this.#description = description;
    this.#illustration = illustration;
  }

  get targetProfileIds() {
    return this.#content
      .filter((requirement) => requirement.type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS)
      .map(({ value }) => parseInt(value));
  }

  get moduleIds() {
    return this.#content.filter((requirement) => requirement.type === TYPES.OBJECT.PASSAGES).map(({ value }) => value);
  }

  toCombinedCourse(code, organizationId, campaigns) {
    const quest = this.toCombinedCourseQuestFormat(campaigns);
    return new CombinedCourse(
      { name: this.#name, code, organizationId, description: this.#description, illustration: this.#illustration },
      quest,
    );
  }

  toCombinedCourseQuestFormat(campaigns) {
    const successRequirements = this.#content.map((requirement) => {
      if (requirement.type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS) {
        const requirementTargetProfileId = requirement.value;
        const campaignId = campaigns.find(({ targetProfileId }) => targetProfileId === requirementTargetProfileId).id;
        return buildRequirement({
          requirement_type: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISONS.ALL,
          data: {
            campaignId: { data: campaignId, comparison: CRITERION_PROPERTY_COMPARISONS.EQUAL },
            status: { data: CampaignParticipationStatuses.SHARED, comparison: CRITERION_PROPERTY_COMPARISONS.EQUAL },
          },
        });
      } else if (requirement.type === TYPES.OBJECT.PASSAGES) {
        return buildRequirement({
          requirement_type: TYPES.OBJECT.PASSAGES,
          comparison: COMPARISONS.ALL,
          data: {
            moduleId: { data: requirement.value, comparison: CRITERION_PROPERTY_COMPARISONS.EQUAL },
            isTerminated: { data: true, comparison: CRITERION_PROPERTY_COMPARISONS.EQUAL },
          },
        });
      } else {
        return requirement;
      }
    });

    return new Quest({
      createdAt: this.#now,
      updatedAt: this.#now,
      rewardType: null,
      rewardId: null,
      eligibilityRequirements: [],
      successRequirements,
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
  combinedCourseContent: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid(TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS, TYPES.OBJECT.PASSAGES).required(),
        value: Joi.alternatives().conditional('type', {
          switch: [
            {
              is: TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
              then: Joi.number().integer().required(),
            },
            {
              is: TYPES.OBJECT.PASSAGES,
              then: Joi.string().required(),
            },
          ],
        }),
      }),
    )
    .required(),
  illustration: Joi.string().allow(null),
  description: Joi.string().allow(null),
}).strict();
