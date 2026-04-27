import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedCatalogueFilter extends Route {
  @service store;
  @service currentUser;
  @service router;

  beforeModel(transition) {
    if (!['all', 'blueprint', 'targetProfile'].includes(transition.to.params?.type)) {
      return this.router.replaceWith('authenticated.catalogue.list', 'all');
    }
  }

  async model({ type }) {
    const items = this.store.peekAll('course');

    if (items.length) {
      return { courses: items, type };
    }
    const courses = await this.store.findAll('course', {
      adapterOptions: { organizationId: this.currentUser.organization.id },
    });
    return { courses, type };
  }
}
