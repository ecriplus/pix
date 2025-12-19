import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { concat, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import Card from '../card';

export default class OrganizationCreationForm extends Component {
  @service store;
  @service intl;

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

  get dpoSectionTitle() {
    return `${this.intl.t('components.organizations.creation.dpo.definition')} (${this.intl.t('components.organizations.creation.dpo.acronym')})`;
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
      <section class="admin-form__content organization-creation-form">
        <Card
          class="admin-form__card organization-creation-form__card"
          @title={{t "components.organizations.creation.general-information"}}
        >
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
              placeholder={{concat
                (t "common.words.example-abbr")
                " "
                (t "components.organizations.creation.name.placeholder")
              }}
            >
              <:label>{{t "components.organizations.creation.name.label"}}</:label>
            </PixInput>
          </div>

          <PixSelect
            @onChange={{this.handleOrganizationTypeSelectionChange}}
            @options={{this.organizationTypes}}
            @placeholder={{t "components.organizations.creation.type.placeholder"}}
            @hideDefaultOption={{true}}
            @value={{@organization.type}}
            required
            aria-required={{true}}
            @requiredLabel={{t "common.fields.required-field"}}
          >
            <:label>{{t "components.organizations.creation.type.label"}}</:label>
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

          <PixInput
            @id="provinceCode"
            {{on "input" (fn this.handleInputChange "provinceCode")}}
            placeholder={{concat (t "common.words.example-abbr") " 078"}}
          >
            <:label>{{t "components.organizations.creation.province-code"}}</:label>
          </PixInput>

          <div class="organization-creation-form__input--full">
            <PixInput
              @id="externalId"
              {{on "input" (fn this.handleInputChange "externalId")}}
              placeholder={{t "components.organizations.creation.external-id.placeholder"}}
            >
              <:label>{{t "components.organizations.creation.external-id.label"}}</:label>
            </PixInput>
          </div>
        </Card>

        <Card
          class="admin-form__card organization-creation-form__card"
          @title={{t "components.organizations.creation.configuration"}}
        >
          <div class="organization-creation-form__input--full">
            <PixInput
              @id="documentationUrl"
              onchange={{this.handleDocumentationUrlChange}}
              placeholder={{concat (t "common.words.example-abbr") " https://www.documentation.org"}}
            >
              <:label>{{t "components.organizations.creation.documentation-link"}}</:label>
            </PixInput>
          </div>
        </Card>

        <Card class="admin-form__card organization-creation-form__card" @title={{this.dpoSectionTitle}}>
          <PixInput
            @id="dataProtectionOfficerLastName"
            onchange={{this.handleDataProtectionOfficerLastNameChange}}
            placeholder={{concat (t "common.words.example-abbr") " Dupont"}}
          >
            <:label>{{t "components.organizations.creation.dpo.lastname"}}
              <abbr title={{t "components.organizations.creation.dpo.definition"}}>{{t
                  "components.organizations.creation.dpo.acronym"
                }}</abbr></:label>
          </PixInput>

          <PixInput
            @id="dataProtectionOfficerFirstName"
            onchange={{this.handleDataProtectionOfficerFirstNameChange}}
            placeholder={{concat (t "common.words.example-abbr") " Jean"}}
          >
            <:label>{{t "components.organizations.creation.dpo.firstname"}}
              <abbr title={{t "components.organizations.creation.dpo.definition"}}>{{t
                  "components.organizations.creation.dpo.acronym"
                }}</abbr></:label>
          </PixInput>

          <div class="organization-creation-form__input--full">
            <PixInput
              @id="dataProtectionOfficerEmail"
              onchange={{this.handleDataProtectionOfficerEmailChange}}
              placeholder={{concat (t "common.words.example-abbr") " jean-dupont@example.net"}}
            >
              <:label>{{t "components.organizations.creation.dpo.email"}}
                <abbr title={{t "components.organizations.creation.dpo.definition"}}>{{t
                    "components.organizations.creation.dpo.acronym"
                  }}</abbr></:label>
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
