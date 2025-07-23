import { service } from '@ember/service';

import ApplicationAdapter from './application';

export default class CampaignParticipationResult extends ApplicationAdapter {
  @service currentUser;

  urlForQueryRecord(query) {
    if (query.userId && query.campaignId) {
      const url = `${this.host}/${this.namespace}/users/${query.userId}/campaigns/${query.campaignId}/assessment-result`;
      delete query.userId;
      delete query.campaignId;
      return url;
    }
    return super.urlForQueryRecord(...arguments);
  }

  urlForFindRecord(id, modelName, { adapterOptions }) {
    const { userId, campaignId } = adapterOptions;
    const url = `${this.host}/${this.namespace}/users/${userId}/campaigns/${campaignId}/assessment-result`;
    return url;
  }

  share(id) {
    const url = `${this.host}/${this.namespace}/campaign-participations/${id}`;
    return this.ajax(url, 'PATCH');
  }

  beginImprovement(id) {
    const url = `${this.host}/${this.namespace}/campaign-participations/${id}/begin-improvement`;
    return this.ajax(url, 'PATCH');
  }
}
