import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Location from 'mon-pix/utils/location';

export default class LoginGarRoute extends Route {
  @service session;

  async beforeModel() {
    const token = decodeURIComponent(Location.getLocationHash().slice(1));
    await this.session.authenticate('authenticator:gar', token);
  }
}
