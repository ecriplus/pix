import Service from '@ember/service';

export default class LocationService extends Service {
  replace(url) {
    window.location.replace(url);
  }
}
