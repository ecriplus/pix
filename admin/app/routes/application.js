import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;
  @service featureToggles;
  @service currentUser;
  @service locale;

  async beforeModel(transition) {
    const queryParams = transition?.to?.queryParams;
    this.locale.setBestLocale({ queryParams });
    await this.session.setup();
    await this.featureToggles.load();
    await this.currentUser.load();
  }
}
