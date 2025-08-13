import Service from '@ember/service';
import last from 'lodash/last';
import Location from 'mon-pix/utils/location';

const FRANCE_TLD = 'fr';

export default class CurrentDomainService extends Service {
  getExtension() {
    return last(Location.getLocationHostname().split('.'));
  }

  get isFranceDomain() {
    return this.getExtension() === FRANCE_TLD;
  }

  get domain() {
    const { host, hostname } = new URL(Location.getLocationHref());

    if (this.isLocalhost) return hostname;

    return host.split('.').slice(-2).join('.');
  }

  get isLocalhost() {
    return Location.getLocationHostname() === 'localhost';
  }

  convertUrlToOrgDomain() {
    if (!this.isFranceDomain || this.isLocalhost) {
      return Location.getLocationHref();
    }

    const url = new URL(Location.getLocationHref());
    url.hostname = `${url.hostname.split('.fr')[0]}.org`;
    return url.toString();
  }
}
