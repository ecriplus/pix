import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedCatalogueIndex extends Route {
  @service router;

  beforeModel() {
    return this.router.replaceWith('authenticated.catalogue.list', 'all');
  }
}
