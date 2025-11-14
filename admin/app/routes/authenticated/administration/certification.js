import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CertificationRoute extends Route {
  @service store;

  async model() {
    const dates = await this.store.findAll('sco-blocked-access-date');
    const version = await this.store.queryRecord('certification-version', {
      scope: 'CORE',
    });
    return {
      scoBlockedAccessDates: dates,
      certificationVersion: version,
    };
  }
}
