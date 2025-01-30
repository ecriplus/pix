import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import TableHeader from '../table/header';
import InvitationsListItem from './invitations-list-item';

export default class TeamInvitationsListComponent extends Component {
  @service store;
  @service notifications;
  @service currentUser;
  @service intl;

  @action
  async cancelInvitation(organizationInvitation) {
    try {
      const organizationId = this.currentUser.organization.id;

      organizationInvitation.deleteRecord();
      await organizationInvitation.save({
        adapterOptions: { organizationInvitationId: organizationInvitation.id, organizationId },
      });

      this.notifications.sendSuccess(this.intl.t('pages.team-invitations.invitation-cancelled-succeed-message'));
    } catch {
      this.notifications.sendError(this.intl.t('api-error-messages.global'));
    }
  }
  <template>
    <div class="panel table content-text content-text--small">
      <table>
        <thead>
          <tr>
            <TableHeader @size="wide">{{t "pages.team-invitations.table.column.email-address"}}</TableHeader>
            <TableHeader @size="x-wide" class="hide-on-mobile">{{t
                "pages.team-invitations.table.column.pending-invitation"
              }}</TableHeader>
            <TableHeader @size="wide" class="hide-on-mobile">
              <span>{{t "common.actions.global"}}</span>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {{#each @invitations as |invitation|}}
            <InvitationsListItem @invitation={{invitation}} @cancelInvitation={{this.cancelInvitation}} />
          {{/each}}
        </tbody>
      </table>
    </div>
  </template>
}
