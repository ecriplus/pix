import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import ENV from 'pix-admin/config/environment';

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

  get hasTags() {
    const tags = this.args.organization.tags;
    return tags?.length > 0;
  }

  get hasChildren() {
    const children = this.args.organization.children;
    return children?.length > 0;
  }

  get externalURL() {
    const urlDashboardPrefix = ENV.APP.ORGANIZATION_DASHBOARD_URL;
    return urlDashboardPrefix && urlDashboardPrefix + this.args.organization.id;
  }

  <template>
    <section class="page-section">
      <div class="organization__header">
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

        <div class="organization__title">
          <h2 class="organization__name">{{@organization.name}}</h2>

          <ul class="organization-tags-list">
            {{#if this.hasChildren}}
              <li>
                <PixTag @color="success">
                  {{t "components.organizations.information-section-view.parent-organization"}}
                </PixTag>
              </li>
            {{/if}}
            {{#if @organization.parentOrganizationId}}
              <li>
                <PixTag class="organization__child-tag" @color="success">
                  {{t "components.organizations.information-section-view.child-organization"}}
                  <LinkTo @route="authenticated.organizations.get" @model={{@organization.parentOrganizationId}}>
                    {{@organization.parentOrganizationName}}
                  </LinkTo>
                </PixTag>
              </li>
            {{/if}}
            {{#if this.hasTags}}
              {{#each @organization.tags as |tag|}}
                <li>
                  <PixTag @color="purple-light">{{tag.name}}</PixTag>
                </li>
              {{/each}}
            {{/if}}
          </ul>
        </div>

        <PixButtonLink
          @variant="secondary"
          @href={{this.externalURL}}
          @size="small"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tableau de bord
        </PixButtonLink>
      </div>

      <div class="organization__information">
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
