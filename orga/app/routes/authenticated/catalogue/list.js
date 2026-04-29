import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedCatalogueFilter extends Route {
  @service store;
  @service currentUser;
  @service router;

  #currentOrgaId = null;

  beforeModel(transition) {
    if (!['all', 'blueprint', 'targetProfile'].includes(transition.to.params?.type)) {
      return this.router.replaceWith('authenticated.catalogue.list', 'all');
    }
  }

  async model({ type }) {
    this.handleCache();
    let courses = this.store.peekAll('course');

    if (courses.length === 0) {
      courses = await this.store.findAll('course', {
        backgroundReload: false,
        adapterOptions: { organizationId: this.currentUser.organization.id },
      });
    }

    return { courses, type };
  }

  handleCache() {
    const orgId = this.currentUser.organization.id;
    if (this.#currentOrgaId !== orgId) {
      this.store.unloadAll('course');
    }
    this.#currentOrgaId = orgId;
  }
}
