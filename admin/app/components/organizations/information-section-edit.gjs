import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { concat, fn, get } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { and, eq, notEq, or } from 'ember-truth-helpers';
import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import Organization from 'pix-admin/models/organization';

export default class OrganizationInformationSectionEditionMode extends Component {
  @service accessControl;
  @service store;
  @service oidcIdentityProviders;
  @service intl;

  @tracked isEditMode = false;
  @tracked showArchivingConfirmationModal = false;
  @tracked toggleLockPlaces = false;
  @tracked administrationTeams = [];

  noIdentityProviderOption = { label: this.intl.t('common.words.none'), value: 'None' };
  garIdentityProviderOption = { label: 'GAR', value: 'GAR' };

  constructor() {
    super(...arguments);
    this.#onMount();

    this.toggleLockPlaces = this.form.features['PLACES_MANAGEMENT']?.active ?? false;
  }

  async #onMount() {
    this._initForm();
    this.administrationTeams = await this.store.findAll('administration-team');
  }

  get isManagingStudentAvailable() {
    return (
      !this.args.organization.isLearnerImportEnabled &&
      (this.args.organization.isOrganizationSCO || this.args.organization.isOrganizationSUP)
    );
  }

  get identityProviderOptions() {
    const oidcIdentityProvidersOptions = this.oidcIdentityProviders.list.map((identityProvider) => ({
      value: identityProvider.code,
      label: identityProvider.organizationName,
    }));
    return [this.noIdentityProviderOption, this.garIdentityProviderOption, ...oidcIdentityProvidersOptions];
  }

  get administrationTeamsOptions() {
    const options = this.administrationTeams.map((administrationTeam) => ({
      value: administrationTeam.id,
      label: administrationTeam.name,
    }));

    return options;
  }

  get translatedAdministrationTeamIdErrorMessage() {
    return this.form.administrationTeamIdError.message
      ? this.intl.t(this.form.administrationTeamIdError.message)
      : null;
  }

  @action
  onChangeIdentityProvider(newIdentityProvider) {
    this.form.identityProviderForCampaigns = newIdentityProvider;
  }

  @action
  onChangeAdministrationTeam(newAdministrationTeamId) {
    this.form.administrationTeamId = newAdministrationTeamId;
  }

  @action
  closeAndResetForm() {
    this.args.toggleEditMode();
    this._initForm();
  }

  @action
  updateFormCheckBoxValue(key) {
    if (key === 'features.PLACES_MANAGEMENT.active') {
      this.toggleLockPlaces = !lodashGet(this.form, key);
    }

    lodashSet(this.form, key, !lodashGet(this.form, key));
  }

  @action
  updateFormValue(key, event) {
    this.form[key] = event.target.value;
  }

  @action
  async updateOrganization(event) {
    event.preventDefault();

    const { validations } = await this.form.validate();
    if (!validations.isValid) {
      return;
    }

    if (this.form.identityProviderForCampaigns === 'None') {
      this.form.identityProviderForCampaigns = null;
    }

    const administrationTeamName = this.administrationTeams.find(
      (team) => team.id === this.form.administrationTeamId,
    )?.name;

    this.args.organization.set('name', this.form.name);
    this.args.organization.set('externalId', this.form.externalId);
    this.args.organization.set('provinceCode', this.form.provinceCode);
    this.args.organization.set('dataProtectionOfficerFirstName', this.form.dataProtectionOfficerFirstName);
    this.args.organization.set('dataProtectionOfficerLastName', this.form.dataProtectionOfficerLastName);
    this.args.organization.set('dataProtectionOfficerEmail', this.form.dataProtectionOfficerEmail);
    this.args.organization.set('email', this.form.email);
    this.args.organization.set('credit', this.form.credit);
    this.args.organization.set('documentationUrl', this.form.documentationUrl);
    this.args.organization.set('identityProviderForCampaigns', this.form.identityProviderForCampaigns);
    this.args.organization.set('features', this.form.features);
    this.args.organization.set('administrationTeamId', this.form.administrationTeamId);
    this.args.organization.set('administrationTeamName', administrationTeamName);

    this.closeAndResetForm();
    return this.args.onSubmit();
  }

  _initForm() {
    this.form = this.store.createRecord('organization-form', {
      name: this.args.organization.name,
      externalId: this.args.organization.externalId,
      provinceCode: this.args.organization.provinceCode,
      dataProtectionOfficerFirstName: this.args.organization.dataProtectionOfficerFirstName,
      dataProtectionOfficerLastName: this.args.organization.dataProtectionOfficerLastName,
      dataProtectionOfficerEmail: this.args.organization.dataProtectionOfficerEmail,
      email: this.args.organization.email,
      credit: this.args.organization.credit,
      documentationUrl: this.args.organization.documentationUrl,
      identityProviderForCampaigns:
        this.args.organization.identityProviderForCampaigns ?? this.noIdentityProviderOption.value,
      features: structuredClone(this.args.organization.features),
      administrationTeamId: this.args.organization.administrationTeamId
        ? `${this.args.organization.administrationTeamId}`
        : null,
    });
  }

  <template>
    <div class="organization__edit-form">
      <form class="form" {{on "submit" this.updateOrganization}}>

        <span class="form__instructions">
          {{t "common.forms.mandatory-fields" htmlSafe=true}}
        </span>

        <div class="form-field">
          <PixInput
            required={{true}}
            @requiredLabel={{t "common.forms.mandatory"}}
            @errorMessage={{this.form.nameError.message}}
            @validationStatus={{this.form.nameError.status}}
            @value={{this.form.name}}
            {{on "input" (fn this.updateFormValue "name")}}
          ><:label>
              {{t "components.organizations.editing.name.label"}}
            </:label></PixInput>
        </div>

        <div class="form-field">
          <PixInput
            @errorMessage={{this.form.externalIdError.message}}
            @validationStatus={{this.form.externalIdError.status}}
            @value={{this.form.externalId}}
            {{on "input" (fn this.updateFormValue "externalId")}}
          ><:label>{{t "components.organizations.information-section-view.external-id"}}</:label></PixInput>
        </div>

        <div class="form-field">
          <PixInput
            @errorMessage={{this.form.provinceCodeError.message}}
            @validationStatus={{this.form.provinceCodeError.status}}
            @value={{this.form.provinceCode}}
            {{on "input" (fn this.updateFormValue "provinceCode")}}
          ><:label>{{t "components.organizations.editing.province-code.label"}}</:label></PixInput>
        </div>

        <div class="form-field">
          <PixSelect
            required
            @aria-required={{true}}
            @requiredLabel={{t "common.forms.mandatory"}}
            @errorMessage={{this.translatedAdministrationTeamIdErrorMessage}}
            @validationStatus={{this.form.administrationTeamIdError.status}}
            @options={{this.administrationTeamsOptions}}
            @value={{this.form.administrationTeamId}}
            @onChange={{this.onChangeAdministrationTeam}}
            @hideDefaultOption={{true}}
            class="admin-form__select"
            @placeholder={{t "components.organizations.editing.administration-team.selector.placeholder"}}
          >
            <:label>{{t "components.organizations.editing.administration-team.selector.label"}}</:label>
          </PixSelect>
        </div>

        <div class="form-field">
          <PixInput
            @errorMessage={{this.form.dataProtectionOfficerFirstNameError.message}}
            @validationStatus={{this.form.dataProtectionOfficerFirstNameError.status}}
            @value={{this.form.dataProtectionOfficerFirstName}}
            {{on "input" (fn this.updateFormValue "dataProtectionOfficerFirstName")}}
          ><:label>{{t "components.organizations.information-section-view.dpo-firstname"}}</:label></PixInput>
        </div>

        <div class="form-field">
          <PixInput
            @errorMessage={{this.form.dataProtectionOfficerLastNameError.message}}
            @validationStatus={{this.form.dataProtectionOfficerLastNameError.status}}
            @value={{this.form.dataProtectionOfficerLastName}}
            {{on "input" (fn this.updateFormValue "dataProtectionOfficerLastName")}}
          ><:label>{{t "components.organizations.information-section-view.dpo-lastname"}}</:label></PixInput>
        </div>

        <div class="form-field">
          <PixInput
            @errorMessage={{this.form.dataProtectionOfficerEmailError.message}}
            @validationStatus={{this.form.dataProtectionOfficerEmailError.status}}
            @value={{this.form.dataProtectionOfficerEmail}}
            {{on "input" (fn this.updateFormValue "dataProtectionOfficerEmail")}}
          ><:label>{{t "components.organizations.information-section-view.dpo-email"}}</:label></PixInput>
        </div>

        <div class="form-field">
          <PixInput
            type="number"
            @errorMessage={{this.form.creditError.message}}
            @validationStatus={{this.form.creditError.status}}
            @value={{this.form.credit}}
            {{on "input" (fn this.updateFormValue "credit")}}
          ><:label>{{t "components.organizations.information-section-view.credits"}}</:label></PixInput>
        </div>

        <div class="form-field">
          <PixInput
            @errorMessage={{this.form.documentationUrlError.message}}
            @validationStatus={{this.form.documentationUrlError.status}}
            @value={{this.form.documentationUrl}}
            {{on "input" (fn this.updateFormValue "documentationUrl")}}
          ><:label>{{t "components.organizations.information-section-view.documentation-link"}}</:label></PixInput>
        </div>

        <div class="form-field">
          <PixSelect
            @options={{this.identityProviderOptions}}
            @value={{this.form.identityProviderForCampaigns}}
            @onChange={{this.onChangeIdentityProvider}}
            @hideDefaultOption={{true}}
            class="admin-form__select"
          >
            <:label>{{t "components.organizations.information-section-view.sso"}}</:label>
          </PixSelect>
        </div>

        <div class="form-field">
          <PixInput
            @errorMessage={{this.form.emailError.message}}
            @validationStatus={{this.form.emailError.status}}
            @value={{this.form.email}}
            {{on "input" (fn this.updateFormValue "email")}}
          ><:label>{{t "components.organizations.information-section-view.sco-activation-email"}}</:label></PixInput>
        </div>

        <FeaturesForm
          @features={{this.form.features}}
          @updateFormCheckBoxValue={{this.updateFormCheckBoxValue}}
          @isManagingStudentAvailable={{this.isManagingStudentAvailable}}
          @toggleLockPlaces={{this.toggleLockPlaces}}
        />

        <div class="form-actions">
          <PixButton @size="small" @variant="secondary" @triggerAction={{this.closeAndResetForm}}>
            {{t "common.actions.cancel"}}
          </PixButton>
          <PixButton @type="submit" @size="small" @variant="success">
            {{t "common.actions.save"}}
          </PixButton>
        </div>
      </form>
    </div>
  </template>
}

function keys(obj) {
  return Object.keys(obj);
}

const FeaturesForm = <template>
  {{#each (keys Organization.editableFeatureList) as |feature|}}
    {{#let
      (get @features feature) (concat "components.organizations.information-section-view.features." feature)
      as |organizationFeature featureLabel|
    }}
      {{#if (or @isManagingStudentAvailable (notEq feature "IS_MANAGING_STUDENTS"))}}
        <div class="form-field">
          <PixCheckbox
            @checked={{organizationFeature.active}}
            {{on "change" (fn @updateFormCheckBoxValue (concat "features." feature ".active"))}}
          ><:label>{{t featureLabel}}</:label></PixCheckbox>
        </div>
      {{/if}}
      {{#if (and (eq feature "PLACES_MANAGEMENT") @toggleLockPlaces)}}
        <div class="form-field">
          <PixCheckbox
            @checked={{organizationFeature.params.enableMaximumPlacesLimit}}
            {{on
              "change"
              (fn @updateFormCheckBoxValue (concat "features." feature ".params.enableMaximumPlacesLimit"))
            }}
          ><:label>{{t
                "components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT"
              }}</:label></PixCheckbox>
        </div>
      {{/if}}
    {{/let}}
  {{/each}}
</template>;
