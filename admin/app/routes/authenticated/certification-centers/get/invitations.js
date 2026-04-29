import Route from '@ember/routing/route';

export default class AuthenticatedCertificationCentersGetInvitationsRoute extends Route {
  async model() {
    const { certificationCenter } = this.modelFor('authenticated.certification-centers.get');
    return {
      certificationCenter,
      certificationCenterId: certificationCenter.id,
      certificationCenterInvitations: await certificationCenter.certificationCenterInvitations,
    };
  }
}
