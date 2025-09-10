import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CampaignsRoute extends Route {
  @service store;
  @service router;

  async model(params) {
    const verifiedCode = await this.store.findRecord('verified-code', params.code);
    if (verifiedCode.type === 'campaign') {
      return this.store.queryRecord('campaign', { filter: { code: params.code } });
    } else {
      this.router.replaceWith('combined-courses', verifiedCode.id);
    }
  }
}
