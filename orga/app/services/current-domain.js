import Service from '@ember/service';
import last from 'lodash/last';
import Location from 'pix-orga/utils/location';

const FRANCE_TLD = 'fr';

export default class CurrentDomainService extends Service {
  get isFranceDomain() {
    return this.getExtension() === FRANCE_TLD;
  }

  get isInternationalDomain() {
    return !this.isFranceDomain;
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

  // TODO: should be moved in url service
  getJuniorBaseUrl(stringUrl = window.location) {
    return `${stringUrl.protocol}//${stringUrl.hostname.replace('orga', 'junior')}`;
  }
}
