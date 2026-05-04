import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedCertificationCentersGetTeamRoute extends Route {
  @service router;
  beforeModel() {
    const { certificationCenter } = this.modelFor('authenticated.certification-centers.get');
    if (certificationCenter.isArchived) {
      return this.router.replaceWith('authenticated.certification-centers.get');
    }
  }

  async model() {
    const { certificationCenter } = this.modelFor('authenticated.certification-centers.get');
    return {
      certificationCenterMemberships: await certificationCenter.certificationCenterMemberships,
      isCertificationCenterArchived: certificationCenter.isArchived,
      certificationCenterId: certificationCenter.id,
    };
  }

  @action
  refreshModel() {
    this.refresh();
  }
}
