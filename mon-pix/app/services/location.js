import Service from '@ember/service';

export default class LocationService extends Service {
  get href() {
    return window.location.href;
  }

  replace(url) {
    window.location.replace(url);
  }

  assign(url) {
    window.location.assign(url);
  }
}
