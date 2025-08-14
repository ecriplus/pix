import Service from '@ember/service';
import last from 'lodash/last';
import Location from 'pix-admin/utils/location';

const FRANCE_TLD = 'fr';

export default class CurrentDomainService extends Service {
  get isFranceDomain() {
    return this.getExtension() === FRANCE_TLD;
  }

  getExtension() {
    const { hostname } = new URL(Location.getHref());
    return last(hostname.split('.'));
  }

  get domain() {
    const { host, hostname } = new URL(Location.getHref());

    if (hostname === 'localhost') return hostname;

    return host.split('.').slice(-2).join('.');
  }
}
