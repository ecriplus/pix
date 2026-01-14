import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SsoSelectionRoute extends Route {
  @service router;
  @service joinInvitation;

  async model(params) {
    const { code, invitationId } = params;
    if (!params.invitationId || !params.code) return null;

    const invitation = await this.joinInvitation.load({ code, invitationId });
    return invitation;
  }

  async redirect(model) {
    if (!model && this.joinInvitation.error) {
      return this.router.replaceWith('authentication.login');
    }
  }
}
