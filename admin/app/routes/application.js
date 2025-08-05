import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;
  @service featureToggles;
  @service currentUser;
  @service locale;

  async beforeModel() {
    await this.session.setup();

    await this.featureToggles.load();

    await this.currentUser.load();

    this.locale.setBestLocale({ user: this.currentUser.user });
  }
}
