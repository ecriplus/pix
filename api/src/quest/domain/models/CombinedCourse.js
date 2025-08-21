import {
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../prescription/shared/domain/constants.js';
import { CombinedCourseItem, ITEM_TYPE } from './CombinedCourseItem.js';
import { Quest } from './Quest.js';
import { TYPES } from './Requirement.js';

export class CombinedCourse {
  #quest;

  constructor({ id, code, organizationId, name } = {}, quest) {
    this.id = id;
    this.code = code;
    this.organizationId = organizationId;
    this.name = name;
    this.#quest = quest;
  }

  get quest() {
    return this.#quest;
  }
}

export class CombinedCourseDetails extends CombinedCourse {
  items = null;

  constructor({ id, code, organizationId, name }, quest, participation) {
    super({ id, code, organizationId, name }, quest);
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

  generateItems(
    data,
    recommendableModuleIds = [],
    recommendedModuleIdsForUser = [],
    encryptedCombinedCourseUrl,
    dataForQuest,
  ) {
    this.items = [];
    for (const requirement of this.quest.successRequirements) {
      if (requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS) {
        const campaign = data.find(({ id }) => id === requirement.data.campaignId.data);
        const isCompleted = requirement.isFulfilled(dataForQuest);
        this.items.push(
          new CombinedCourseItem({
            id: campaign.id,
            reference: campaign.code,
            title: campaign.name,
            type: ITEM_TYPE.CAMPAIGN,
            isCompleted,
          }),
        );
      } else if (requirement.requirement_type === TYPES.OBJECT.PASSAGES) {
        const module = data.find(({ id }) => id === requirement.data.moduleId.data);

        const isRecommandable = recommendableModuleIds.find(
          (potentiallyRecommendedModule) => potentiallyRecommendedModule.moduleId === module.id,
        );

        if (isRecommandable) {
          const isRecommended = recommendedModuleIdsForUser.find(
            (recommendedModule) => recommendedModule.moduleId === module.id,
          );
          if (!isRecommended) {
            continue;
          }
        }

        const isCompleted = requirement.isFulfilled(dataForQuest);
        this.items.push(
          new CombinedCourseItem({
            id: module.id,
            reference: module.slug,
            title: module.title,
            type: ITEM_TYPE.MODULE,
            redirection: encryptedCombinedCourseUrl,
            isCompleted,
          }),
        );
      }
    }
  }
}
