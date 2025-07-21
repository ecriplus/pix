import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { concat, get } from '@ember/helper';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { and, eq } from 'ember-truth-helpers';
import { DescriptionList } from 'pix-admin/components/ui/description-list';
import Organization from 'pix-admin/models/organization';

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
          Archivée le
          {{@organization.archivedFormattedDate}}
          par
          {{@organization.archivistFullName}}.
        </PixNotificationAlert>
      {{/if}}

      <div>
        <OrganizationDescription @organization={{@organization}} />

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
    </div>
  </template>
}

class OrganizationDescription extends Component {
  @service oidcIdentityProviders;

  get identityProviderName() {
    const GARIdentityProvider = { code: 'GAR', organizationName: 'GAR' };
    const allIdentityProviderList = [...this.oidcIdentityProviders.list, GARIdentityProvider];
    const identityProvider = allIdentityProviderList.find(
      (identityProvider) => identityProvider.code === this.args.organization.identityProviderForCampaigns,
    );
    const identityProviderName = identityProvider?.organizationName;
    return identityProviderName || 'Aucun';
  }

  <template>
    <DescriptionList>
      <DescriptionList.Divider />

      <DescriptionList.Item @label="Type">
        {{@organization.type}}
      </DescriptionList.Item>
      <DescriptionList.Item @label="Créée par">
        {{@organization.creatorFullName}}
        ({{@organization.createdBy}})
      </DescriptionList.Item>
      <DescriptionList.Item @label="Créée le">
        {{@organization.createdAtFormattedDate}}
      </DescriptionList.Item>
      {{#if @organization.externalId}}
        <DescriptionList.Item @label="Identifiant externe">
          {{@organization.externalId}}
        </DescriptionList.Item>
      {{/if}}
      {{#if @organization.provinceCode}}
        <DescriptionList.Item @label="Département">
          {{@organization.provinceCode}}
        </DescriptionList.Item>
      {{/if}}

      <DescriptionList.Divider />

      <DescriptionList.Item @label="Nom du DPO">
        {{@organization.dataProtectionOfficerFullName}}
      </DescriptionList.Item>
      <DescriptionList.Item @label="Adresse e-mail du DPO">
        {{@organization.dataProtectionOfficerEmail}}
      </DescriptionList.Item>

      <DescriptionList.Divider />

      <DescriptionList.Item @label="Crédits">
        {{@organization.credit}}
      </DescriptionList.Item>
      <DescriptionList.Item @label="Lien vers la documentation">
        {{#if @organization.documentationUrl}}
          <a href="{{@organization.documentationUrl}}" target="_blank" rel="noopener noreferrer">
            {{@organization.documentationUrl}}
          </a>
        {{else}}
          Non spécifié
        {{/if}}
      </DescriptionList.Item>
      <DescriptionList.Item @label="SSO">
        {{this.identityProviderName}}
      </DescriptionList.Item>

      <DescriptionList.Divider />

      <DescriptionList.Item @label="Adresse e-mail d'activation SCO">
        {{@organization.email}}
      </DescriptionList.Item>

      {{#if @organization.code}}
        <DescriptionList.Divider />

        <DescriptionList.Item @label="Code">
          {{@organization.code}}
        </DescriptionList.Item>
      {{/if}}

      <DescriptionList.Divider />

      <DescriptionList.Item @label={{t "components.organizations.information-section-view.features.title"}}>
        <FeaturesSection @features={{@organization.features}} />
      </DescriptionList.Item>

      <DescriptionList.Divider />
    </DescriptionList>
  </template>
}

function keys(obj) {
  return Object.keys(obj);
}

const FeaturesSection = <template>
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
            6ème
          </Feature>
        {{else}}
          <Feature @label={{t featureLabel}} @value={{organizationFeature.active}} />
        {{/if}}
      {{/let}}
    {{/each}}
  </ul>
</template>;

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
