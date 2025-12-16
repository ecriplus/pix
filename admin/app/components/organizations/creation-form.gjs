import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import Card from '../card';

export default class OrganizationCreationForm extends Component {
  @service store;

  organizationTypes = [
    { value: 'PRO', label: 'Organisation professionnelle' },
    { value: 'SCO', label: 'Établissement scolaire' },
    { value: 'SUP', label: 'Établissement supérieur' },
    { value: 'SCO-1D', label: 'Établissement scolaire du premier degré' },
  ];

  get administrationTeamsOptions() {
    const options = this.args.administrationTeams.map((administrationTeam) => ({
      value: administrationTeam.id,
      label: administrationTeam.name,
    }));
    return options;
  }

  get countriesOptions() {
    const options = this.args.countries.map((country) => ({
      value: country.code,
      label: `${country.name} (${country.code})`,
    }));

    return options;
  }

  get submitButtonText() {
    return this.args.parentOrganizationName
      ? 'components.organizations.creation.actions.add-child-organization'
      : 'common.actions.add';
  }

  @action
  handleOrganizationTypeSelectionChange(value) {
    this.args.organization.type = value;
  }

  @action
  handleOrganizationNameChange(event) {
    this.args.organization.name = event.target.value;
  }

  @action
  handleAdministrationTeamSelectionChange(value) {
    this.args.organization.administrationTeamId = value;
  }

  @action
  handleCountrySelectionChange(value) {
    this.args.organization.countryCode = value;
  }

  @action
  handleDocumentationUrlChange(event) {
    this.args.organization.documentationUrl = event.target.value;
  }

  @action
  handleCreditsChange(event) {
    this.args.organization.credit = +event.target.value;
  }

  @action
  handleDataProtectionOfficerFirstNameChange(event) {
    this.args.organization.dataProtectionOfficerFirstName = event.target.value;
  }

  @action
  handleDataProtectionOfficerLastNameChange(event) {
    this.args.organization.dataProtectionOfficerLastName = event.target.value;
  }

  @action
  handleDataProtectionOfficerEmailChange(event) {
    this.args.organization.dataProtectionOfficerEmail = event.target.value;
  }

  @action
  handleInputChange(key, event) {
    this.args.organization[key] = event.target.value;
  }

  <template>
    <form class="admin-form" {{on "submit" @onSubmit}}>
      <p class="admin-form__mandatory-text">
        {{t "common.forms.mandatory-fields" htmlSafe=true}}
      </p>
      <section class="admin-form__content admin-form__content--with-counters organization-creation-form">
        <Card class="admin-form__card organization-creation-form__card" @title="Information générique">
          {{#if @parentOrganizationName}}
            <h2 class="admin-form__content title organization-creation-form__parent-name--full">
              {{t
                "components.organizations.creation.parent-organization-name"
                parentOrganizationName=@parentOrganizationName
              }}
            </h2>
          {{/if}}

          <div class="organization-creation-form__input--full">
            <PixInput
              @id="organizationName"
              onchange={{this.handleOrganizationNameChange}}
              required={{true}}
              aria-required={{true}}
              @requiredLabel={{t "common.fields.required-field"}}
            >
              <:label>Nom</:label>
            </PixInput>
          </div>

          <PixSelect
            @onChange={{this.handleOrganizationTypeSelectionChange}}
            @options={{this.organizationTypes}}
            @placeholder="Type d'organisation"
            @hideDefaultOption={{true}}
            @value={{@organization.type}}
            required
            aria-required={{true}}
            @requiredLabel={{t "common.fields.required-field"}}
          >
            <:label>Sélectionner un type d'organisation</:label>
            <:default as |organizationType|>{{organizationType.label}}</:default>
          </PixSelect>

          <PixSelect
            @onChange={{this.handleAdministrationTeamSelectionChange}}
            @options={{this.administrationTeamsOptions}}
            @placeholder={{t "components.organizations.creation.administration-team.selector.placeholder"}}
            @hideDefaultOption={{true}}
            @value={{@organization.administrationTeamId}}
            required
            aria-required={{true}}
            @requiredLabel={{t "common.fields.required-field"}}
          >
            <:label>{{t "components.organizations.creation.administration-team.selector.label"}}</:label>
          </PixSelect>

          <PixSelect
            @onChange={{this.handleCountrySelectionChange}}
            @options={{this.countriesOptions}}
            @placeholder={{t "components.organizations.creation.country.selector.placeholder"}}
            @hideDefaultOption={{true}}
            @value={{@organization.countryCode}}
            required
            @aria-required={{true}}
            @requiredLabel={{t "common.fields.required-field"}}
            @isSearchable={{true}}
          >
            <:label>{{t "components.organizations.creation.country.selector.label"}}</:label>
          </PixSelect>

          <PixInput @id="provinceCode" {{on "input" (fn this.handleInputChange "provinceCode")}}>
            <:label>{{t "components.organizations.creation.province-code"}}</:label>
          </PixInput>

          <div class="organization-creation-form__input--full">
            <PixInput @id="externalId" {{on "input" (fn this.handleInputChange "externalId")}}>
              <:label>{{t "components.organizations.creation.external-id"}}</:label>
            </PixInput>
          </div>
        </Card>

        <Card class="admin-form__card organization-creation-form__card" @title="Configuration">
          <div class="organization-creation-form__input--full">
            <PixInput @id="documentationUrl" onchange={{this.handleDocumentationUrlChange}}>
              <:label>Lien vers la documentation</:label>
            </PixInput>
          </div>
        </Card>

        <Card class="admin-form__card organization-creation-form__card" @title="Data Privacy Officer">
          <PixInput @id="dataProtectionOfficerLastName" onchange={{this.handleDataProtectionOfficerLastNameChange}}>
            <:label>Nom du DPO</:label>
          </PixInput>

          <PixInput @id="dataProtectionOfficerFirstName" onchange={{this.handleDataProtectionOfficerFirstNameChange}}>
            <:label>Prénom du DPO</:label>
          </PixInput>

          <div class="organization-creation-form__input--full">
            <PixInput @id="dataProtectionOfficerEmail" onchange={{this.handleDataProtectionOfficerEmailChange}}>
              <:label>Adresse e-mail du DPO</:label>
            </PixInput>
          </div>
        </Card>
      </section>

      <section class="admin-form__actions">
        <PixButton @size="small" @variant="secondary" @triggerAction={{@onCancel}}>
          {{t "common.actions.cancel"}}
        </PixButton>
        <PixButton @type="submit" @size="small" @variant="success">
          {{t this.submitButtonText}}
        </PixButton>
      </section>
    </form>
  </template>
}
