import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { concat, get } from '@ember/helper';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { formatList, t } from 'ember-intl';
import { and, eq } from 'ember-truth-helpers';
import Organization from 'pix-admin/models/organization';

import Card from '../card';

export default class OrganizationInformationSection extends Component {
  @service accessControl;
  @service intl;

  get isManagingStudentAvailable() {
    return (
      !this.args.organization.isLearnerImportEnabled &&
      (this.args.organization.isOrganizationSCO || this.args.organization.isOrganizationSUP)
    );
  }

  <template>
    <div class="organization__data">
      {{#if @organization.isArchived}}
        <PixNotificationAlert class="organization-information-section__archived-message" @type="warning">
          {{t
            "components.organizations.information-section-view.is-archived-warning"
            archivedAt=@organization.archivedFormattedDate
            archivedBy=@organization.archivistFullName
          }}
        </PixNotificationAlert>
      {{/if}}

      <div>
        <OrganizationDescription @organization={{@organization}} />

        {{#if this.accessControl.hasAccessToOrganizationActionsScope}}
          <div class="form-actions organization-information__actions">
            <PixButton @variant="secondary" @size="small" @triggerAction={{@toggleEditMode}}>
              {{t "common.actions.edit"}}
            </PixButton>
            {{#unless @organization.isArchived}}
              <PixButton @variant="error" @size="small" @triggerAction={{@toggleArchivingConfirmationModal}}>
                {{t "components.organizations.information-section-view.archive-organization.action"}}
              </PixButton>
            {{/unless}}
          </div>
        {{/if}}
      </div>
    </div>
  </template>
}

class OrganizationDescription extends Component {
  @service oidcIdentityProviders;
  @service intl;

  get identityProviderName() {
    const GARIdentityProvider = { code: 'GAR', organizationName: 'GAR' };
    const allIdentityProviderList = [...this.oidcIdentityProviders.list, GARIdentityProvider];
    const identityProvider = allIdentityProviderList.find(
      (identityProvider) => identityProvider.code === this.args.organization.identityProviderForCampaigns,
    );
    const identityProviderName = identityProvider?.organizationName;
    return identityProviderName || this.intl.t('common.words.none');
  }

  get dpoSectionTitle() {
    return `${this.intl.t('components.organizations.creation.dpo.definition')} (${this.intl.t('components.organizations.creation.dpo.acronym')})`;
  }

  get country() {
    //TODO: remove condition based on countryCode when it becomes not nullable at the end of Epix
    if (!this.args.organization.countryCode && !this.args.organization.countryName) {
      return this.intl.t('common.not-specified');
    }

    if (this.args.organization.countryCode && !this.args.organization.countryName) {
      return this.intl.t('components.organizations.information-section-view.country.not-found', {
        countryCode: this.args.organization.countryCode,
      });
    }

    return `${this.args.organization.countryName} (${this.args.organization.countryCode})`;
  }

  <template>
    <section class="admin-form__content">
      <Card
        class="admin-form__card organization-information-section__card organization-information-section__card--general"
        @title={{t "components.organizations.creation.general-information"}}
      >
        <div class="organization-information-section__left-block">
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.type"
              }}</span>
            <span class="organization-information-section__value">{{@organization.type}}</span>
          </div>
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.created-by"
              }}</span>
            <span class="organization-information-section__value">{{@organization.creatorFullName}}
              ({{@organization.createdBy}})</span>
          </div>
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.created-at"
              }}</span>
            <span class="organization-information-section__value">{{@organization.createdAtFormattedDate}}</span>
          </div>
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.administration-team"
              }}</span>
            <span class="organization-information-section__value">{{if
                @organization.administrationTeamName
                @organization.administrationTeamName
                (t "common.not-specified")
              }}</span>
          </div>
        </div>
        <div class="organization-information-section__right-block">
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.country.label"
              }}</span>
            <span class="organization-information-section__value">{{this.country}}</span>
          </div>
          {{#if @organization.provinceCode}}
            <div class="organization-information-section__field">
              <span class="organization-information-section__label">{{t
                  "components.organizations.information-section-view.province-code"
                }}</span>
              <span class="organization-information-section__value">{{@organization.provinceCode}}</span>
            </div>
          {{/if}}
          {{#if @organization.externalId}}
            <div class="organization-information-section__field">
              <span class="organization-information-section__label">{{t
                  "components.organizations.information-section-view.external-id"
                }}</span>
              <span class="organization-information-section__value">{{@organization.externalId}}</span>
            </div>
          {{/if}}
        </div>
      </Card>

      <div class="organization-information-section__side-by-side">
        <Card
          class="admin-form__card organization-information-section__card organization-information-section__card--side"
          @title={{t "components.organizations.creation.configuration"}}
        >
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.credits"
              }}</span>
            <span class="organization-information-section__value">{{@organization.credit}}</span>
          </div>
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.documentation-link"
              }}</span>
            <span class="organization-information-section__value">
              {{#if @organization.documentationUrl}}
                <a href="{{@organization.documentationUrl}}" target="_blank" rel="noopener noreferrer">
                  {{@organization.documentationUrl}}
                </a>
              {{else}}
                {{t "common.not-specified"}}
              {{/if}}
            </span>
          </div>
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.sso"
              }}</span>
            <span class="organization-information-section__value">{{this.identityProviderName}}</span>
          </div>
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.sco-activation-email"
              }}</span>
            <span class="organization-information-section__value">{{@organization.email}}</span>
          </div>
          {{#if @organization.code}}
            <div class="organization-information-section__field">
              <span class="organization-information-section__label">{{t
                  "components.organizations.information-section-view.code"
                }}</span>
              <span class="organization-information-section__value">{{@organization.code}}</span>
            </div>
          {{/if}}
        </Card>

        <Card
          class="admin-form__card organization-information-section__card organization-information-section__card--side"
          @title={{this.dpoSectionTitle}}
        >
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.dpo-name"
              }}</span>
            <span class="organization-information-section__value">{{@organization.dataProtectionOfficerFullName}}</span>
          </div>
          <div class="organization-information-section__field">
            <span class="organization-information-section__label">{{t
                "components.organizations.information-section-view.dpo-email"
              }}</span>
            <span class="organization-information-section__value">{{@organization.dataProtectionOfficerEmail}}</span>
          </div>
        </Card>
      </div>

      <Card
        class="admin-form__card organization-information-section__card"
        @title={{t "components.organizations.creation.features"}}
      >
        <div class="organization-information-section__field">
          <span class="organization-information-section__value">
            <FeaturesSection @features={{@organization.features}} />
          </span>
        </div>
      </Card>
    </section>
  </template>
}

function keys(obj) {
  return Object.keys(obj);
}

class FeaturesSection extends Component {
  @service intl;

  attestationLabels = (attestations) => {
    return attestations?.map((name) =>
      this.intl.t(`components.organizations.information-section-view.features.attestation-list.${name}`),
    );
  };

  getOrganizationPlacesLimitText = (isActive) => {
    if (isActive)
      return this.intl.t(
        'components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.enabled',
      );
    return this.intl.t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.disabled');
  };

  <template>
    <ul class="organization-information-section__features">
      {{#each (keys Organization.featureList) as |feature|}}
        {{#let
          (get @features feature) (concat "components.organizations.information-section-view.features." feature)
          as |organizationFeature featureLabel|
        }}
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
              {{formatList (this.attestationLabels organizationFeature.params)}}
            </Feature>
          {{else if (eq feature "PLACES_MANAGEMENT")}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}}>
              {{this.getOrganizationPlacesLimitText organizationFeature.params.enableMaximumPlacesLimit}}
            </Feature>
          {{else}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}} />
          {{/if}}
        {{/let}}
      {{/each}}
    </ul>
  </template>
}

const Feature = <template>
  <li
    class={{if
      @value
      "organization-information-section__features--enabled"
      "organization-information-section__features--disabled"
    }}
  >
    {{#if @value}}
      <PixIcon @name="checkCircle" aria-label={{concat @label " : " (t "common.words.yes")}} />
    {{else}}
      <PixIcon @name="cancel" aria-label={{concat @label " : " (t "common.words.no")}} />
    {{/if}}
    {{@label}}
    {{#if (and @value (has-block))}}
      :
      {{yield}}
    {{/if}}
  </li>
</template>;
