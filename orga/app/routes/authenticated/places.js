import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedPlacesRoute extends Route {
  @service currentUser;
  @service router;
  @service store;

  beforeModel() {
    if (!(this.currentUser.isAdminInOrganization && this.currentUser.prescriber.placesManagement)) {
      this.router.replaceWith('application');
    }
  }

  async model() {
    const placesLots = await this.store.query('organization-places-lot', {
      filter: { organizationId: this.currentUser.organization.id },
    });
    const statistics = await this.currentUser.organizationPlaceStatistics;
    return {
      statistics,
      placesLots,
    };
  }
}
