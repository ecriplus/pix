import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { concat, get } from '@ember/helper';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';
import ENV from 'pix-admin/config/environment';
import Organization from 'pix-admin/models/organization';

export default class OrganizationInformationSection extends Component {
  @service oidcIdentityProviders;
  @service accessControl;
  @service intl;

  get isManagingStudentAvailable() {
    return (
      !this.args.organization.isLearnerImportEnabled &&
      (this.args.organization.isOrganizationSCO || this.args.organization.isOrganizationSUP)
    );
  }

  get identityProviderName() {
    const GARIdentityProvider = { code: 'GAR', organizationName: 'GAR' };
    const allIdentityProviderList = [...this.oidcIdentityProviders.list, GARIdentityProvider];
    const identityProvider = allIdentityProviderList.find(
      (identityProvider) => identityProvider.code === this.args.organization.identityProviderForCampaigns,
    );
    const identityProviderName = identityProvider?.organizationName;
    return identityProviderName ?? 'Aucun';
  }

  get externalURL() {
    const urlDashboardPrefix = ENV.APP.ORGANIZATION_DASHBOARD_URL;
    return urlDashboardPrefix && urlDashboardPrefix + this.args.organization.id;
  }

  get hasTags() {
    const tags = this.args.organization.tags;
    return tags?.length > 0;
  }

  get hasChildren() {
    const children = this.args.organization.children;
    return children?.length > 0;
  }

  <template>
    <div class="organization__data">
      <h2 class="organization__name">{{@organization.name}}</h2>

      {{#if this.hasTags}}
        <ul class="organization-tags-list">
          {{#each @organization.tags as |tag|}}
            <li class="organization-tags-list__tag">
              <PixTag @color="purple-light">{{tag.name}}</PixTag>
            </li>
          {{/each}}
        </ul>
      {{/if}}

      {{#if this.hasChildren}}
        <div class="organization__network-label">
          <PixTag @color="success">
            {{t "components.organizations.information-section-view.parent-organization"}}
          </PixTag>
        </div>
      {{/if}}

      {{#if @organization.parentOrganizationId}}
        <div class="organization__network-label">
          <PixTag class="organization__child-tag" @color="success">
            {{t "components.organizations.information-section-view.child-organization"}}
            <LinkTo @route="authenticated.organizations.get" @model={{@organization.parentOrganizationId}}>
              {{@organization.parentOrganizationName}}
            </LinkTo>
          </PixTag>
        </div>
      {{/if}}

      {{#if @organization.isArchived}}
        <PixNotificationAlert class="organization-information-section__archived-message" @type="warning">
          Archivée le
          {{@organization.archivedFormattedDate}}
          par
          {{@organization.archivistFullName}}.
        </PixNotificationAlert>
      {{/if}}

      <div class="organization-information-section__content">
        <div class="organization-information-section__details">
          <OrganizationDescription @organization={{@organization}} />
          <FeaturesSection @features={{@organization.features}} />
          {{#if this.accessControl.hasAccessToOrganizationActionsScope}}
            <div class="form-actions">
              <PixButton @variant="secondary" @size="small" @triggerAction={{@toggleEditMode}}>
                {{t "common.actions.edit"}}
              </PixButton>
              {{#unless @organization.isArchived}}
                <PixButton @variant="error" @size="small" @triggerAction={{@toggleArchivingConfirmationModal}}>
                  Archiver l'organisation
                </PixButton>
              {{/unless}}
            </div>
          {{/if}}
        </div>
        <div>
          <PixButtonLink
            @variant="secondary"
            @href={{this.externalURL}}
            @size="small"
            target="_blank"
            rel="noopener noreferrer"
          >Tableau de bord
          </PixButtonLink>
        </div>
      </div>
    </div>
  </template>
}

const OrganizationDescription = <template>
  <ul class="organization-information-section__details__list">
    <li>Type : {{@organization.type}}</li>
    <li>Créée par : {{@organization.creatorFullName}} ({{@organization.createdBy}})</li>
    <li>Créée le : {{@organization.createdAtFormattedDate}}</li>
    {{#if @organization.externalId}}
      <li>Identifiant externe : {{@organization.externalId}}</li>
    {{/if}}
    {{#if @organization.provinceCode}}
      <li>Département : {{@organization.provinceCode}}</li>
    {{/if}}

    <br />

    <li>Nom du DPO : {{@organization.dataProtectionOfficerFullName}}</li>
    <li>Adresse e-mail du DPO : {{@organization.dataProtectionOfficerEmail}}</li>
    <br />
    <li>Crédits : {{@organization.credit}}</li>
    <li>Lien vers la documentation :
      {{#if @organization.documentationUrl}}
        <a
          href="{{@organization.documentationUrl}}"
          target="_blank"
          rel="noopener noreferrer"
        >{{@organization.documentationUrl}}</a>
      {{else}}
        Non spécifié
      {{/if}}
    </li>
    <li>SSO : {{this.identityProviderName}}</li>

    <br />

    <li>Adresse e-mail d'activation SCO : {{@organization.email}}</li>
    {{#if @organization.code}}
      <br />
      <li>Code : {{@organization.code}}</li>
    {{/if}}
  </ul>
</template>;

function keys(obj) {
  return Object.keys(obj);
}

const FeaturesSection = <template>
  <h3 class="page-section__title page-section__title--sub">{{t
      "components.organizations.information-section-view.features.title"
    }}
    :
  </h3>
  <ul class="organization-information-section__details__list">
    {{#each (keys Organization.featureList) as |feature|}}
      {{#let
        (get @features feature) (concat "components.organizations.information-section-view.features." feature)
        as |organizationFeature featureLabel|
      }}
        <li>
          {{#if (eq feature "SHOW_NPS")}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}}>
              <a
                rel="noopener noreferrer"
                href={{organizationFeature.params.formNPSUrl}}
                target="_blank"
              >{{organizationFeature.params.formNPSUrl}}</a>
            </Feature>
          {{else if (eq feature "LEARNER_IMPORT")}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}}>
              {{organizationFeature.params.name}}
            </Feature>
          {{else if (eq feature "ATTESTATIONS_MANAGEMENT")}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}}>
              6ème
            </Feature>
          {{else}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}} />
          {{/if}}
        </li>
      {{/let}}
    {{/each}}
  </ul>
</template>;

function displayBooleanState(bool) {
  return bool ? 'common.words.yes' : 'common.words.no';
}

const Feature = <template>
  {{@label}}
  :
  {{#if (has-block)}}
    {{#if @value}}
      {{yield}}
    {{else}}
      {{t "common.words.no"}}
    {{/if}}
  {{else}}
    {{t (displayBooleanState @value)}}
  {{/if}}
</template>;
