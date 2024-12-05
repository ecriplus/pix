import Route from '@ember/routing/route';

export default class UserCguRoute extends Route {
  async model() {
    const user = this.modelFor('authenticated.users.get');
    return {
      cgu: user.cgu,
      pixOrgaTermsOfServiceAccepted: user.pixOrgaTermsOfServiceAccepted,
      pixCertifTermsOfServiceAccepted: user.pixCertifTermsOfServiceAccepted,
      lastTermsOfServiceValidatedAt: user.lastTermsOfServiceValidatedAt,
      lastPixOrgaTermsOfServiceValidatedAt: user.lastPixOrgaTermsOfServiceValidatedAt,
      lastPixCertifTermsOfServiceValidatedAt: user.lastPixCertifTermsOfServiceValidatedAt,
    };
  }
}
