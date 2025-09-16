import Joi from 'joi';

import {
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../prescription/shared/domain/constants.js';
import { EntityValidationError } from '../../../shared/domain/errors.js';
import { CombinedCourseItem, ITEM_TYPE } from './CombinedCourseItem.js';
import { Quest } from './Quest.js';
import { TYPES } from './Requirement.js';

const schema = Joi.object({
  id: Joi.number().allow(null),
  code: Joi.string().required(),
  organizationId: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().allow(null),
  illustration: Joi.string().allow(null),
});
export class CombinedCourse {
  #quest;

  constructor({ id, code, organizationId, name, description, illustration } = {}, quest) {
    this.id = id;
    this.code = code;
    this.organizationId = organizationId;
    this.name = name;
    this.description = description;
    this.illustration = illustration;

    this.#validate({ id, code, organizationId, name, description, illustration });

    this.#quest = quest;
  }

  get quest() {
    return this.#quest;
  }

  #validate(combinedCourse) {
    const { error } = schema.validate(combinedCourse);
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details, undefined, { data: combinedCourse });
    }
  }
}

export class CombinedCourseDetails extends CombinedCourse {
  items = null;

  constructor({ id, code, organizationId, name, description, illustration }, quest, participation) {
    super({ id, code, organizationId, name, description, illustration }, quest);
    if (!participation) {
      this.status = CombinedCourseStatuses.NOT_STARTED;
    } else {
      this.status =
        participation.status === CombinedCourseParticipationStatuses.STARTED
          ? CombinedCourseStatuses.STARTED
          : CombinedCourseStatuses.COMPLETED;
    }
  }

  get campaignIds() {
    return this.quest.successRequirements
      .filter((requirement) => requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS)
      .map(({ data }) => data.campaignId.data);
  }

  get moduleIds() {
    return this.quest.successRequirements
      .filter((requirement) => requirement.requirement_type === TYPES.OBJECT.PASSAGES)
      .map(({ data }) => data.moduleId.data);
  }

  isCompleted(dataForQuest, recommendableModuleIds = [], recommendedModuleIdsForUser = []) {
    const successRequirements = this.quest.successRequirements.filter((req) => {
      if (req.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS) {
        return true;
      } else if (req.requirement_type === TYPES.OBJECT.PASSAGES) {
        const moduleId = req.data.moduleId.data;

        const isRecommandable = recommendableModuleIds.find(
          (potentiallyRecommendedModule) => potentiallyRecommendedModule.moduleId === moduleId,
        );

        if (isRecommandable) {
          const isRecommended = recommendedModuleIdsForUser.find(
            (recommendedModule) => recommendedModule.moduleId === moduleId,
          );
          if (!isRecommended) {
            return false;
          }
        }

        return true;
      }
    });

    const questForUser = new Quest({
      ...this.quest,
      eligibilityRequirements: this.quest.eligibilityRequirements,
      successRequirements,
    });

    return questForUser.isSuccessful(dataForQuest);
  }

  #createCampaignCombinedCourseItem(campaign, isCompleted, isLocked) {
    return new CombinedCourseItem({
      id: campaign.id,
      reference: campaign.code,
      title: campaign.title,
      type: ITEM_TYPE.CAMPAIGN,
      isCompleted,
      isLocked,
    });
  }

  #createModuleCombinedCourseItem(module, encryptedCombinedCourseUrl, isCompleted, isLocked) {
    return new CombinedCourseItem({
      id: module.id,
      reference: module.slug,
      title: module.title,
      type: ITEM_TYPE.MODULE,
      redirection: encryptedCombinedCourseUrl,
      isCompleted,
      isLocked,
      duration: module?.duration,
      image: module.image,
    });
  }

  #createFormationCombinedCourseItem(targetProfileId) {
    return new CombinedCourseItem({
      id: 'formation_' + this.quest.id + '_' + targetProfileId,
      reference: targetProfileId,
      type: ITEM_TYPE.FORMATION,
    });
  }

  #createFormationCombinedCourseItemIfNeeded(recommandableModule, targetProfileIdsThatNeedAFormationItem) {
    const targetProfileId = recommandableModule.targetProfileIds.find((t) =>
      targetProfileIdsThatNeedAFormationItem.includes(t),
    );
    const shouldBeInFormationItem = Boolean(targetProfileId);
    const hasFormationItem = this.items.find((item) => {
      if (item.type !== ITEM_TYPE.FORMATION) return false;
      if (item.reference === targetProfileId) return true;
      return false;
    });
    if (shouldBeInFormationItem) {
      if (!hasFormationItem) {
        return this.#createFormationCombinedCourseItem(targetProfileId);
      } else {
        return undefined;
      }
    }
  }

  #isCombinedCourseItemLocked(previousItem) {
    if (!previousItem) {
      return false;
    }
    if (previousItem.isLocked) {
      return true;
    } else {
      return previousItem.isCompleted ? false : true;
    }
  }

  generateItems({
    itemDetails,
    recommendableModuleIds = [],
    recommendedModuleIdsForUser = [],
    encryptedCombinedCourseUrl,
    dataForQuest,
  }) {
    this.items = [];
    const targetProfileIdsThatNeedAFormationItem = [];
    for (const requirement of this.quest.successRequirements) {
      const previousItem = this.items[this.items.length - 1];
      const isLocked = this.#isCombinedCourseItemLocked(previousItem);
      if (requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS) {
        const campaign = itemDetails.find(({ id }) => id === requirement.data.campaignId.data);

        const isCompleted = requirement.isFulfilled(dataForQuest);

        const doesCampaignRecommendModules =
          recommendableModuleIds.find((recommandableModule) => {
            if (!this.moduleIds.includes(recommandableModule.moduleId)) return false;
            return recommandableModule.targetProfileIds.includes(campaign.targetProfileId);
          }) ?? [];
        if (doesCampaignRecommendModules && !isCompleted) {
          targetProfileIdsThatNeedAFormationItem.push(campaign.targetProfileId);
        }
        this.items.push(this.#createCampaignCombinedCourseItem(campaign, isCompleted, isLocked));
      } else if (requirement.requirement_type === TYPES.OBJECT.PASSAGES) {
        const isCompleted = requirement.isFulfilled(dataForQuest);
        const module = itemDetails.find(({ id }) => id === requirement.data.moduleId.data);

        const recommandableModule = recommendableModuleIds.find(
          (potentiallyRecommendedModule) => potentiallyRecommendedModule.moduleId === module.id,
        );
        const isRecommandable = Boolean(recommandableModule);

        if (!isRecommandable) {
          this.items.push(
            this.#createModuleCombinedCourseItem(module, encryptedCombinedCourseUrl, isCompleted, isLocked),
          );
          continue;
        }

        const isRecommended = recommendedModuleIdsForUser.find(
          (recommendedModule) => recommendedModule.moduleId === module.id,
        );

        if (isRecommended) {
          this.items.push(
            this.#createModuleCombinedCourseItem(module, encryptedCombinedCourseUrl, isCompleted, isLocked),
          );
          continue;
        }

        const formationCombinedCourseItem = this.#createFormationCombinedCourseItemIfNeeded(
          recommandableModule,
          targetProfileIdsThatNeedAFormationItem,
        );

        if (formationCombinedCourseItem) {
          this.items.push(formationCombinedCourseItem);
        }
      }
    }
  }
}
