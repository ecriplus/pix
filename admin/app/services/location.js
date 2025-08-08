import Service from '@ember/service';

export default class LocationService extends Service {
  get href() {
    return window.location.href;
  }

  replace(url) {
    return location.replace(url);
  }
}
