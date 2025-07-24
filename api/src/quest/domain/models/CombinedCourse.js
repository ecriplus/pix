import {
  CombinedCourseParticipationStatuses,
  CombinedCourseStatuses,
} from '../../../prescription/shared/domain/constants.js';
import { CombinedCourseItem } from './CombinedCourseItem.js';

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
    return this.#quest.successRequirements.map(({ data }) => data.campaignId.data);
  }

  generateItems(data) {
    this.items = this.#quest.successRequirements.map((requirement) => {
      const campaign = data.find(({ id }) => id === requirement.data.campaignId.data);
      return new CombinedCourseItem({ id: campaign.id, reference: campaign.code, title: campaign.name });
    });
  }
}
