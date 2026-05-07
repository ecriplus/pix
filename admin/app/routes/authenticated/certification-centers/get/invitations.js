import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedCertificationCentersGetInvitationsRoute extends Route {
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
      certificationCenter,
      certificationCenterId: certificationCenter.id,
      certificationCenterInvitations: await certificationCenter.certificationCenterInvitations,
    };
  }
}
