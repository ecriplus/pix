import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CampaignsRoute extends Route {
  @service store;
  @service router;
  @service metrics;

  async model(params) {
    const verifiedCode = await this.store.findRecord('verified-code', params.code);
    if (verifiedCode.type === 'campaign') {
      return this.store.queryRecord('campaign', { filter: { code: params.code } });
    } else {
      this.router.replaceWith('combined-courses', verifiedCode.id);
    }
  }

  activate() {
    this.metrics.context.code = this.paramsFor('campaigns').code;
    this.metrics.context.type = 'campaigns';
  }

  deactivate() {
    delete this.metrics.context.code;
    delete this.metrics.context.type;
  }
}
