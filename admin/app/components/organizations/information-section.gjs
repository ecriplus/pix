import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import ArchivingConfirmationModal from './archiving-confirmation-modal';
import InformationSectionEdit from './information-section-edit';
import InformationSectionView from './information-section-view';

export default class OrganizationInformationSection extends Component {
  @service accessControl;
  @tracked isEditMode = false;
  @tracked showArchivingConfirmationModal = false;

  @action
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  @action
  toggleArchivingConfirmationModal() {
    this.showArchivingConfirmationModal = !this.showArchivingConfirmationModal;
  }

  @action
  archiveOrganization() {
    this.toggleArchivingConfirmationModal();
    this.args.archiveOrganization();
  }

  <template>
    <section class="page-section">
      <div class="organization__information {{if this.isEditMode 'organization__information--editing'}}">
        {{#if this.isEditMode}}
          <InformationSectionEdit
            @organization={{@organization}}
            @toggleEditMode={{this.toggleEditMode}}
            @cancel={{this.cancel}}
            @onSubmit={{@onSubmit}}
          />
        {{else}}
          <InformationSectionView
            @organization={{@organization}}
            @toggleEditMode={{this.toggleEditMode}}
            @toggleArchivingConfirmationModal={{this.toggleArchivingConfirmationModal}}
          />
        {{/if}}

        <ArchivingConfirmationModal
          @organizationName={{@organization.name}}
          @toggleArchivingConfirmationModal={{this.toggleArchivingConfirmationModal}}
          @archiveOrganization={{this.archiveOrganization}}
          @displayModal={{this.showArchivingConfirmationModal}}
        />
      </div>
    </section>
  </template>
}
