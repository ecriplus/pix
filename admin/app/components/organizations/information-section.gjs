import { on } from '@ember/modifier';
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
  onLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.args.organization.logoUrl = reader.result;
      this.args.onLogoUpdated();
    };
    reader.readAsDataURL(file);
  }

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
      <div class="organization__information">
        <div class="organization__logo">
          <figure class="organization__logo-figure">
            {{#if @organization.logoUrl}}
              {{! template-lint-disable no-redundant-role }}
              <img src={{@organization.logoUrl}} alt="" role="presentation" />
            {{else}}
              {{! template-lint-disable no-redundant-role }}
              <img src="{{this.rootURL}}/logo-placeholder.png" alt="" role="presentation" />
            {{/if}}

            <label class="file-upload">
              <input type="file" accept="image/*" hidden {{on "change" this.onLogoUpload}} />
            </label>
          </figure>
        </div>

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
