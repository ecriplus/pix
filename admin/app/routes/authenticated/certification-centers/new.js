import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NewRoute extends Route {
  @service store;

  async model() {
    const habilitations = await this.store.findAll('complementary-certification');
    return { habilitations };
  }
}
