import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import sortBy from 'lodash/sortBy';

import { types } from '../../models/certification-center';

export default class InformationEdit extends Component {
  @service store;
  @tracked selectedHabilitations = [];
  certificationCenterTypes = types;

  constructor() {
    super(...arguments);
    this.form = this.store.createRecord('certification-center-form');
    this.loadForm();
  }

  get sortedHabilitations() {
    return sortBy(this.args.availableHabilitations, 'id');
  }

  onFormInputChange = (name) => (event) => {
    this.form.set(name, event.target.value);
  };

  onTypeChange = (value) => {
    this.form.set('type', value ? value.trim() : value);
  };

  onToggleHabilitation = (habilitation) => {
    const index = this.selectedHabilitations.findIndex((h) => h.id === habilitation.id);
    if (index !== -1) {
      this.selectedHabilitations.splice(index, 1);
      this.selectedHabilitations = [...this.selectedHabilitations];
    } else {
      this.selectedHabilitations = [...this.selectedHabilitations, habilitation];
    }
  };

  isSelectedHabilitation = (habilitation) => {
    const index = this.selectedHabilitations.findIndex((h) => h.id === habilitation.id);
    return index !== -1;
  };

  save = async (event) => {
    event.preventDefault();

    const { validations } = await this.form.validate();
    if (!validations.isValid) return;

    this.applyFormToModel();
    this.args.toggleEditMode();
    return this.args.onSubmit();
  };

  loadForm = async () => {
    this.selectedHabilitations = await this.args.certificationCenter.habilitations;

    const properties = this.args.certificationCenter.getProperties(
      'name',
      'externalId',
      'type',
      'dataProtectionOfficerFirstName',
      'dataProtectionOfficerLastName',
      'dataProtectionOfficerEmail',
    );

    this.form.setProperties(properties);
  };

  applyFormToModel = () => {
    this.args.certificationCenter.setProperties({
      name: this.form.name,
      externalId: this.form.externalId || null,
      type: this.form.type,
      habilitations: this.selectedHabilitations,
      dataProtectionOfficerFirstName: this.form.dataProtectionOfficerFirstName,
      dataProtectionOfficerLastName: this.form.dataProtectionOfficerLastName,
      dataProtectionOfficerEmail: this.form.dataProtectionOfficerEmail,
    });
  };

  <template>
    <h2 class="certification-center-information__edit-title">Modifier un centre de certification</h2>
    <form class="form certification-center-information__edit-form" onsubmit={{this.save}}>

      <PixInput
        class={{if this.form.validations.attrs.name.isInValid "form-control is-invalid" "form-control"}}
        @value={{this.form.name}}
        @requiredLabel={{true}}
        {{on "input" (this.onFormInputChange "name")}}
      >
        <:label>Nom du centre</:label>
      </PixInput>

      {{#if this.form.validations.attrs.name.isInvalid}}
        <span class="error" aria-label="Message d'erreur du champ nom">
          {{this.form.validations.attrs.name.message}}
        </span>
      {{/if}}

      <PixSelect
        @options={{this.certificationCenterTypes}}
        @placeholder="-- Choisissez --"
        @value={{this.form.type}}
        @onChange={{this.onTypeChange}}
        @errorMessage={{this.form.validations.attrs.type.message}}
      >
        <:label>Type</:label>
        <:default as |certificationCenterType|>{{certificationCenterType.label}}</:default>
      </PixSelect>

      <PixInput
        class={{if this.form.validations.attrs.externalId.isInvalid "form-control is-invalid" "form-control"}}
        @value={{this.form.externalId}}
        {{on "input" (this.onFormInputChange "externalId")}}
      >
        <:label>Identifiant externe</:label>
      </PixInput>

      {{#if this.form.validations.attrs.externalId.isInvalid}}
        <span class="error" aria-label="Message d'erreur du champ ID externe">
          {{this.form.validations.attrs.externalId.message}}
        </span>
      {{/if}}

      <PixInput
        class={{if
          this.form.validations.attrs.dataProtectionOfficerFirstName.isInvalid
          "form-control is-invalid"
          "form-control"
        }}
        @value={{this.form.dataProtectionOfficerFirstName}}
        {{on "input" (this.onFormInputChange "dataProtectionOfficerFirstName")}}
      >
        <:label>Prénom du <abbr title="Délégué à la protection des données">DPO</abbr></:label>
      </PixInput>

      {{#if this.form.validations.attrs.dataProtectionOfficerFirstName.isInvalid}}
        <span class="error" aria-label="Message d'erreur du champ Prénom du DPO">
          {{this.form.validations.attrs.dataProtectionOfficerFirstName.message}}
        </span>
      {{/if}}

      <PixInput
        class={{if
          this.form.validations.attrs.dataProtectionOfficerLastName.isInvalid
          "form-control is-invalid"
          "form-control"
        }}
        @value={{this.form.dataProtectionOfficerLastName}}
        {{on "input" (this.onFormInputChange "dataProtectionOfficerLastName")}}
      ><:label>Nom du <abbr title="Délégué à la protection des données">DPO</abbr></:label></PixInput>

      {{#if this.form.validations.attrs.dataProtectionOfficerLastName.isInvalid}}
        <span class="error" aria-label="Message d'erreur du champ Nom du DPO">
          {{this.form.validations.attrs.dataProtectionOfficerLastName.message}}
        </span>
      {{/if}}

      <PixInput
        class={{if
          this.form.validations.attrs.dataProtectionOfficerEmail.isInvalid
          "form-control is-invalid"
          "form-control"
        }}
        @value={{this.form.dataProtectionOfficerEmail}}
        {{on "input" (this.onFormInputChange "dataProtectionOfficerEmail")}}
      ><:label>Adresse e-mail du <abbr title="Délégué à la protection des données">DPO</abbr></:label></PixInput>

      {{#if this.form.validations.attrs.dataProtectionOfficerEmail.isInvalid}}
        <span class="error" aria-label="Message d'erreur du champ Adresse e-mail du DPO">
          {{this.form.validations.attrs.dataProtectionOfficerEmail.message}}
        </span>
      {{/if}}

      <span class="field-label">Habilitations aux certifications complémentaires</span>
      <ul class="form-field certification-center-information__edit-form__habilitations-checkbox-list">
        {{#each this.sortedHabilitations as |habilitation|}}
          <li class="habilitation-entry">
            <PixCheckbox
              @checked={{this.isSelectedHabilitation habilitation}}
              {{on "change" (fn this.onToggleHabilitation habilitation)}}
            >
              <:label>
                {{habilitation.label}}
              </:label>
            </PixCheckbox>
          </li>
        {{/each}}
      </ul>

      <div class="certification-center-information__action-buttons">
        <PixButton @size="small" @variant="secondary" @triggerAction={{@toggleEditMode}}>
          {{t "common.actions.cancel"}}
        </PixButton>
        <PixButton @type="submit" @size="small" @variant="primary" @triggerAction={{this.updateCertificationCenter}}>
          {{t "common.actions.save"}}
        </PixButton>
      </div>
    </form>
  </template>
}
