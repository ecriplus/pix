import Service from '@ember/service';
import last from 'lodash/last';
import Location from 'mon-pix/utils/location';

const FRANCE_TLD = 'fr';

export default class CurrentDomainService extends Service {
  getExtension() {
    const { hostname } = new URL(Location.getHref());
    return last(hostname.split('.'));
  }

  get isFranceDomain() {
    return this.getExtension() === FRANCE_TLD;
  }

  get domain() {
    const { host, hostname } = new URL(Location.getHref());

    if (this.isLocalhost) return hostname;

    return host.split('.').slice(-2).join('.');
  }

  get isLocalhost() {
    const { hostname } = new URL(Location.getHref());

    return hostname === 'localhost';
  }

  convertUrlToOrgDomain() {
    if (!this.isFranceDomain || this.isLocalhost) {
      return Location.getHref();
    }

    const url = new URL(Location.getHref());
    url.hostname = `${url.hostname.split('.fr')[0]}.org`;
    return url.toString();
  }
}
