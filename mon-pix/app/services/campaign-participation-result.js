import Service, { service } from '@ember/service';

export default class CampaignParticipationResult extends Service {
  @service store;

  async share(campaignParticipationResult, questResults) {
    const adapter = this.store.adapterFor('campaign-participation-result');

    if (questResults && questResults.length > 0 && questResults[0].obtained) {
      await adapter.shareProfileReward(campaignParticipationResult.id, questResults[0].profileRewardId);
    }

    await adapter.share(campaignParticipationResult.id);
  }
}
