import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class SupHeaderActions extends Component {
  @service currentUser;

  <template>
    <div class="organization-participant-list-page__header">
      <div class="page-title">{{t "pages.sup-organization-participants.title" count=@participantCount}}</div>
      {{#if this.currentUser.isAdminInOrganization}}
        <div class="organization-participant-list-page__import-students-button hide-on-mobile">
          <PixButtonLink @route="authenticated.import-organization-participants">
            {{t "components.organization-participants-header.import-button"}}
          </PixButtonLink>
        </div>
      {{/if}}
    </div>
  </template>
}
