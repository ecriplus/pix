import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'pix-certif/config/environment';

export default class ApplicationRoute extends Route {
  @service featureToggles;
  @service currentDomain;
  @service session;
  @service store;

  async beforeModel(transition) {
    await this.session.setup();
    await this.featureToggles.load();
    await this.session.loadCurrentUserAndSetLocale(transition);
  }

  async model() {
    const informationBanner = await this.store.findRecord('information-banner', `${ENV.APP.APPLICATION_NAME}`);
    return {
      title: this.currentDomain.isFranceDomain ? 'Pix Certif (France)' : 'Pix Certif (hors France)',
      headElement: document.querySelector('head'),
      informationBanner,
    };
  }

  afterModel() {
    this.poller = setInterval(async () => {
      try {
        this.store.findRecord('information-banner', `${ENV.APP.APPLICATION_NAME}`);
      } catch {
        this.#stopPolling();
      }
    }, ENV.APP.INFORMATION_BANNER_POLLING_TIME);
  }

  deactivate() {
    this.#stopPolling();
  }

  @action
  error() {
    this.#stopPolling();
    return true;
  }

  #stopPolling() {
    if (this.poller) {
      clearInterval(this.poller);
      this.poller = null;
    }
  }
}
