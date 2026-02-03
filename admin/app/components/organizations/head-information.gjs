import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import ENV from 'pix-admin/config/environment';

export default class HeadInformation extends Component {
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
        <h1 class="organization__name">{{@organization.name}}</h1>

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
        class="organization__dashboard-button"
        @variant="secondary"
        @href={{this.externalURL}}
        @size="small"
        target="_blank"
        rel="noopener noreferrer"
      >
        Tableau de bord
      </PixButtonLink>
    </div>
  </template>
}
