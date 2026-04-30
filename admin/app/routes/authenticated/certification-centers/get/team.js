import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class AuthenticatedCertificationCentersGetTeamRoute extends Route {
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
