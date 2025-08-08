import {
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../prescription/shared/domain/constants.js';
import { CombinedCourseItem, ITEM_TYPE } from './CombinedCourseItem.js';
import { TYPES } from './Requirement.js';

export class CombinedCourse {
  constructor({ id, code, organizationId, name } = {}) {
    this.id = id;
    this.code = code;
    this.organizationId = organizationId;
    this.name = name;
  }
}

export class CombinedCourseDetails extends CombinedCourse {
  #quest;
  items = null;

  constructor({ id, code, organizationId, name }, quest, participation) {
    super({ id, code, organizationId, name });
    this.#quest = quest;
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
    return this.#quest.successRequirements
      .filter((requirement) => requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS)
      .map(({ data }) => data.campaignId.data);
  }

  get moduleIds() {
    return this.#quest.successRequirements
      .filter((requirement) => requirement.requirement_type === TYPES.OBJECT.PASSAGES)
      .map(({ data }) => data.moduleId.data);
  }

  generateItems(data, recommendableModuleIds = [], recommendedModuleIdsForUser = [], hashedCombinedCourseUrl) {
    this.items = [];
    for (const requirement of this.#quest.successRequirements) {
      if (requirement.requirement_type === TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS) {
        const campaign = data.find(({ id }) => id === requirement.data.campaignId.data);
        this.items.push(
          new CombinedCourseItem({
            id: campaign.id,
            reference: campaign.code,
            title: campaign.name,
            type: ITEM_TYPE.CAMPAIGN,
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

        this.items.push(
          new CombinedCourseItem({
            id: module.id,
            reference: module.slug,
            title: module.title,
            type: ITEM_TYPE.MODULE,
            redirection: hashedCombinedCourseUrl,
          }),
        );
      }
    }
  }
}
