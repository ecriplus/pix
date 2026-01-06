import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { concat, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import Card from '../card';

export default class OrganizationCreationForm extends Component {
  @service store;
  @service intl;

  @tracked form = {
    administrationTeamId: this.parentOrganizationAdministrationTeamId,
    type: this.parentOrganizationType,
  };

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
    return this.args.parentOrganization?.name
      ? 'components.organizations.creation.actions.add-child-organization'
      : 'common.actions.add';
  }

  get dpoSectionTitle() {
    return `${this.intl.t('components.organizations.creation.dpo.definition')} (${this.intl.t('components.organizations.creation.dpo.acronym')})`;
  }

  get parentOrganizationAdministrationTeamId() {
    return this.args.parentOrganization?.administrationTeamId
      ? `${this.args.parentOrganization.administrationTeamId}`
      : undefined;
  }

  get parentOrganizationType() {
    return this.args.parentOrganization?.type ? `${this.args.parentOrganization.type}` : undefined;
  }

  handleInputChange = (key, event) => {
    this.form = { ...this.form, [key]: event.target.value };
  };

  handleSelectChange = (key, value) => {
    this.form = { ...this.form, [key]: value };
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.args.onSubmit(this.form);
  };

  <template>
    <form class="admin-form" {{on "submit" this.handleSubmit}}>
      <p class="admin-form__mandatory-text">
        {{t "common.forms.mandatory-fields" htmlSafe=true}}
      </p>
      <section class="admin-form__content organization-creation-form">
        <Card
          class="admin-form__card organization-creation-form__card"
          @title={{t "components.organizations.creation.general-information"}}
        >
          {{#if @parentOrganization}}
            <h2 class="admin-form__content title organization-creation-form__parent-name--full">
              {{t
                "components.organizations.creation.parent-organization-name"
                parentOrganizationName=@parentOrganization.name
              }}
            </h2>
          {{/if}}

          <div class="organization-creation-form__input--full">
            <PixInput
              @id="organizationName"
              {{on "change" (fn this.handleInputChange "name")}}
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
            @onChange={{fn this.handleSelectChange "type"}}
            @options={{this.organizationTypes}}
            @placeholder={{t "components.organizations.creation.type.placeholder"}}
            @hideDefaultOption={{true}}
            @value={{this.form.type}}
            required
            aria-required={{true}}
            @requiredLabel={{t "common.fields.required-field"}}
          >
            <:label>{{t "components.organizations.creation.type.label"}}</:label>
            <:default as |organizationType|>{{organizationType.label}}</:default>
          </PixSelect>

          <PixSelect
            @onChange={{fn this.handleSelectChange "administrationTeamId"}}
            @options={{this.administrationTeamsOptions}}
            @placeholder={{t "components.organizations.creation.administration-team.selector.placeholder"}}
            @hideDefaultOption={{true}}
            @value={{this.form.administrationTeamId}}
            required
            aria-required={{true}}
            @requiredLabel={{t "common.fields.required-field"}}
          >
            <:label>{{t "components.organizations.creation.administration-team.selector.label"}}</:label>
          </PixSelect>

          <PixSelect
            @onChange={{fn this.handleSelectChange "countryCode"}}
            @options={{this.countriesOptions}}
            @placeholder={{t "components.organizations.creation.country.selector.placeholder"}}
            @hideDefaultOption={{true}}
            @value={{this.form.countryCode}}
            required
            @aria-required={{true}}
            @requiredLabel={{t "common.fields.required-field"}}
            @isSearchable={{true}}
          >
            <:label>{{t "components.organizations.creation.country.selector.label"}}</:label>
          </PixSelect>

          <PixInput
            @id="provinceCode"
            {{on "change" (fn this.handleInputChange "provinceCode")}}
            placeholder={{concat (t "common.words.example-abbr") " 078"}}
          >
            <:label>{{t "components.organizations.creation.province-code"}}</:label>
          </PixInput>

          <div class="organization-creation-form__input--full">
            <PixInput
              @id="externalId"
              {{on "change" (fn this.handleInputChange "externalId")}}
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
              {{on "change" (fn this.handleInputChange "documentationUrl")}}
              placeholder={{concat (t "common.words.example-abbr") " https://www.documentation.org"}}
            >
              <:label>{{t "components.organizations.creation.documentation-link"}}</:label>
            </PixInput>
          </div>
        </Card>

        <Card class="admin-form__card organization-creation-form__card" @title={{this.dpoSectionTitle}}>
          <PixInput
            @id="dataProtectionOfficerLastName"
            {{on "change" (fn this.handleInputChange "dataProtectionOfficerLastName")}}
            placeholder={{concat (t "common.words.example-abbr") " Dupont"}}
          >
            <:label>{{t "components.organizations.creation.dpo.lastname"}}
              <abbr title={{t "components.organizations.creation.dpo.definition"}}>{{t
                  "components.organizations.creation.dpo.acronym"
                }}</abbr></:label>
          </PixInput>

          <PixInput
            @id="dataProtectionOfficerFirstName"
            {{on "change" (fn this.handleInputChange "dataProtectionOfficerFirstName")}}
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
              {{on "change" (fn this.handleInputChange "dataProtectionOfficerEmail")}}
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
