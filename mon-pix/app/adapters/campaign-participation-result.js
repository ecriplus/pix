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

  share(id) {
    const url = `${this.host}/${this.namespace}/campaign-participations/${id}`;
    return this.ajax(url, 'PATCH');
  }

  shareProfileReward(campaignParticipationId, profileRewardId) {
    const payload = { data: { data: { attributes: { profileRewardId, campaignParticipationId } } } };
    const url = `${this.host}/${this.namespace}/users/${this.currentUser.user.id}/profile/share-reward`;
    return this.ajax(url, 'POST', payload);
  }

  beginImprovement(id) {
    const url = `${this.host}/${this.namespace}/campaign-participations/${id}/begin-improvement`;
    return this.ajax(url, 'PATCH');
  }
}
