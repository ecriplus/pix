import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { concat, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import sortBy from 'lodash/sortBy';

import { types } from '../../models/certification-center';

export default class CreationForm extends Component {
  @service pixToast;
  @service router;
  @service store;

  @tracked name = '';
  @tracked type = '';
  @tracked externalId = '';
  @tracked dataProtectionOfficerFirstName = '';
  @tracked dataProtectionOfficerLastName = '';
  @tracked dataProtectionOfficerEmail = '';
  @tracked selectedHabilitations = [];

  certificationCenterTypes = types;

  get sortedHabilitations() {
    return sortBy(this.args.habilitations, 'id');
  }

  onNameChange = (event) => {
    this.name = event.target.value;
  };

  onTypeChange = (value) => {
    this.type = value;
  };

  onExternalIdChange = (event) => {
    this.externalId = event.target.value;
  };

  onDataProtectionOfficerFirstNameChange = (event) => {
    this.dataProtectionOfficerFirstName = event.target.value;
  };

  onDataProtectionOfficerLastNameChange = (event) => {
    this.dataProtectionOfficerLastName = event.target.value;
  };

  onDataProtectionOfficerEmailChange = (event) => {
    this.dataProtectionOfficerEmail = event.target.value;
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

  save = async (event) => {
    event.preventDefault();

    const record = this.store.createRecord('certification-center', {
      name: this.name,
      type: this.type,
      externalId: this.externalId?.trim() ? this.externalId : null,
      dataProtectionOfficerFirstName: this.dataProtectionOfficerFirstName,
      dataProtectionOfficerLastName: this.dataProtectionOfficerLastName,
      dataProtectionOfficerEmail: this.dataProtectionOfficerEmail,
      habilitations: [...this.selectedHabilitations],
    });

    try {
      await record.save();
      this.pixToast.sendSuccessNotification({ message: 'Le centre de certification a été créé avec succès.' });
      this.router.transitionTo('authenticated.certification-centers.get', record.id);
    } catch (error) {
      const message = error?.errors ? error.errors?.map((e) => e.detail).join(', ') : 'Une erreur est survenue.';
      this.pixToast.sendErrorNotification({ message });
    }
  };

  <template>
    <form class="form certification-center-form" {{on "submit" this.save}}>

      <PixInput
        @id="certificationCenterName"
        onchange={{this.onNameChange}}
        class="form-field"
        required={{true}}
        aria-required={{true}}
      >
        <:label>Nom du centre</:label>
      </PixInput>

      <div class="form-field">
        <PixSelect
          @options={{this.certificationCenterTypes}}
          @placeholder="-- Choisissez --"
          @hideDefaultOption={{true}}
          @onChange={{this.onTypeChange}}
          @value={{this.type}}
          @required={{true}}
          aria-required={{true}}
        >
          <:label>Type d'établissement</:label>
          <:default as |certificationCenterType|>{{certificationCenterType.label}}</:default>
        </PixSelect>
      </div>

      <PixInput @id="certificationCenterExternalId" onchange={{this.onExternalIdChange}} class="form-field">
        <:label>Identifiant externe</:label>
      </PixInput>

      <PixInput
        @id="dataProtectionOfficerFirstName"
        {{on "change" this.onDataProtectionOfficerFirstNameChange}}
        class="form-field"
      >
        <:label>Prénom du DPO</:label>
      </PixInput>

      <PixInput
        @id="dataProtectionOfficerLastName"
        {{on "change" this.onDataProtectionOfficerLastNameChange}}
        class="form-field"
      >
        <:label>Nom du DPO</:label>
      </PixInput>

      <PixInput
        @id="dataProtectionOfficerEmail"
        {{on "change" this.onDataProtectionOfficerEmailChange}}
        class="form-field"
      >
        <:label>Adresse e-mail du DPO</:label>
      </PixInput>

      <section>
        <h2 class="habilitations-title">Habilitations aux certifications complémentaires</h2>
        <ul class="form-field habilitations-checkbox-list">
          {{#each this.sortedHabilitations as |habilitation index|}}
            <li class="habilitation-entry">
              <PixCheckbox
                @id={{concat "habilitation_" index}}
                @size="small"
                onChange={{fn this.onToggleHabilitation habilitation}}
              >
                <:label>{{habilitation.label}}</:label>
              </PixCheckbox>
            </li>
          {{/each}}
        </ul>
      </section>

      <ul class="form-actions">
        <li>
          <PixButton @size="small" @variant="secondary" @triggerAction={{@onCancel}}>
            {{t "common.actions.cancel"}}
          </PixButton>
        </li>
        <li>
          <PixButton @type="submit" @size="small">
            {{t "common.actions.add"}}
          </PixButton>
        </li>
      </ul>
    </form>
  </template>
}
