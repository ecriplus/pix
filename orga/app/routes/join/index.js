import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JoinRoute extends Route {
  @service router;
  @service session;
  @service joinInvitation;

  beforeModel() {
    this.session.prohibitAuthentication('join-when-authenticated');
  }

  async model(params) {
    const { code, invitationId } = params;
    const invitation = await this.joinInvitation.load({ code, invitationId });
    return invitation;
  }

  async redirect(model) {
    if (!model) {
      return this.router.replaceWith('authentication.login');
    }
  }
}
