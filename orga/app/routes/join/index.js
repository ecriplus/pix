import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { SessionStorageEntry } from 'pix-orga/utils/session-storage-entry';

export default class JoinRoute extends Route {
  @service router;
  @service session;
  @service store;

  routeIfAlreadyAuthenticated = 'join-when-authenticated';
  @tracked isInvitationCancelled = false;
  @tracked hasInvitationAlreadyBeenAccepted = false;

  beforeModel() {
    this.session.prohibitAuthentication(this.routeIfAlreadyAuthenticated);
  }

  async model(params) {
    const { code, invitationId } = params;

    try {
      const model = await this.store.queryRecord('organization-invitation', { invitationId, code });

      const joinInvitationData = {
        invitationId,
        code,
        organizationName: model.organizationName,
      };

      const invitationStorage = new SessionStorageEntry('joinInvitationData');
      invitationStorage.set(joinInvitationData);

      return model;
    } catch (errorResponse) {
      errorResponse.errors.forEach((error) => {
        if (error.status === '403') {
          this.isInvitationCancelled = true;
        }
        if (error.status === '412') {
          this.hasInvitationAlreadyBeenAccepted = true;
        }
      });
    }
  }

  async redirect(model) {
    if (!model) {
      const transition = this.router.replaceWith('authentication.login');
      transition.data.isInvitationCancelled = this.isInvitationCancelled;
      transition.data.hasInvitationAlreadyBeenAccepted = this.hasInvitationAlreadyBeenAccepted;

      return transition;
    }
  }
}
