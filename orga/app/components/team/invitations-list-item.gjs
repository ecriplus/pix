import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';
import ENV from 'pix-orga/config/environment';

export default class InvitationsListItem extends Component {
  @service store;
  @service notifications;
  @service currentUser;
  @service intl;

  @tracked isResending = false;

  @action
  async resendInvitation(organizationInvitation) {
    this.isResending = true;
    try {
      const organizationId = this.currentUser.organization.id;
      await organizationInvitation.save({
        adapterOptions: {
          resendInvitation: true,
          email: organizationInvitation.email,
          organizationId,
        },
      });

      this.notifications.sendSuccess(
        this.intl.t('pages.team-new.success.invitation', { email: organizationInvitation.email }),
      );
    } catch {
      this.notifications.sendError(this.intl.t('api-error-messages.global'));
    } finally {
      setTimeout(() => {
        this.isResending = false;
      }, ENV.APP.MILLISECONDS_BEFORE_MAIL_RESEND);
    }
  }

  <template>
    <tr aria-label="{{t 'pages.team-invitations.table.row.aria-label'}}">
      <td>{{@invitation.email}}</td>
      <td class="hide-on-mobile">
        {{dayjsFormat @invitation.updatedAt "DD/MM/YYYY [-] HH:mm"}}
      </td>
      <td>
        <div class="invitations-list__action">
          <PixTooltip @isInline={{true}}>
            <:triggerElement>
              <PixIconButton
                @ariaLabel={{t "pages.team-invitations.resend-invitation"}}
                @iconName="refresh"
                @triggerAction={{fn this.resendInvitation @invitation}}
                @withBackground={{true}}
                disabled={{this.isResending}}
                aria-disabled={{this.isResending}}
              />
            </:triggerElement>
            <:tooltip>
              {{#if this.isResending}}
                {{t "pages.team-invitations.invitation-resent-succeed-message"}}
              {{else}}
                {{t "pages.team-invitations.resend-invitation"}}
              {{/if}}
            </:tooltip>
          </PixTooltip>

          <PixTooltip @isInline={{true}}>
            <:triggerElement>
              <PixIconButton
                @ariaLabel={{t "pages.team-invitations.cancel-invitation"}}
                @iconName="delete"
                @triggerAction={{fn @cancelInvitation @invitation}}
                @withBackground={{true}}
              />
            </:triggerElement>
            <:tooltip>
              {{t "pages.team-invitations.cancel-invitation"}}
            </:tooltip>
          </PixTooltip>
        </div>
      </td>
    </tr>
  </template>
}
