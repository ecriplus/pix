import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class JoinController extends Controller {
  @service store;
  @service session;

  queryParams = ['code', 'invitationId'];
  code = null;
  invitationId = null;

  get routeQueryParams() {
    return { code: this.code, invitationId: this.invitationId };
  }

  @action
  async joinAndAuthenticate(login, password) {
    try {
      await this._acceptOrganizationInvitation(this.invitationId, this.code, login);
    } catch (responseError) {
      const error = responseError?.errors[0];
      const isUserAlreadyOrganizationMember = error?.status === '412';
      if (!isUserAlreadyOrganizationMember) {
        throw responseError;
      }
    }

    await this.session.authenticate('authenticator:oauth2', login, password);
  }

  async _acceptOrganizationInvitation(organizationInvitationId, organizationInvitationCode, email) {
    const type = 'organization-invitation-response';
    const id = `${organizationInvitationId}_${organizationInvitationCode}`;
    const organizationInvitationRecord = this.store.peekRecord(type, id);

    if (!organizationInvitationRecord) {
      let record;
      try {
        record = this.store.createRecord(type, { id, code: organizationInvitationCode, email });
        await record.save({ adapterOptions: { organizationInvitationId } });
      } catch (error) {
        record.deleteRecord();
        throw error;
      }
    }
  }
}
