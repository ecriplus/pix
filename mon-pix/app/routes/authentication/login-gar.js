import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Location from 'mon-pix/utils/location';

export default class LoginGarRoute extends Route {
  @service session;

  async beforeModel() {
    const { hash } = new URL(Location.getHref());
    const token = decodeURIComponent(hash.slice(1));
    await this.session.authenticate('authenticator:gar', token);
  }
}
