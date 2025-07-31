import Service, { service } from '@ember/service';
import last from 'lodash/last';
import PixWindow from 'mon-pix/utils/pix-window';

const FRANCE_TLD = 'fr';

export default class CurrentDomainService extends Service {
  @service location;

  getExtension() {
    return last(PixWindow.getLocationHostname().split('.'));
  }

  get isFranceDomain() {
    return this.getExtension() === FRANCE_TLD;
  }

  get domain() {
    const { host, hostname } = new URL(this.location.href);

    if (this.isLocalhost) return hostname;

    return host.split('.').slice(-2).join('.');
  }

  get isLocalhost() {
    return PixWindow.getLocationHostname() === 'localhost';
  }

  convertUrlToOrgDomain() {
    if (!this.isFranceDomain || this.isLocalhost) {
      return PixWindow.getLocationHref();
    }

    const url = new URL(PixWindow.getLocationHref());
    url.hostname = `${url.hostname.split('.fr')[0]}.org`;
    return url.toString();
  }
}
