import PixButton from '@1024pix/pix-ui/components/pix-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';

import CandidateEditModal from '../../candidate-edit-modal';

export default class CertificationInformationCandidate extends Component {
  @service pixToast;

  @tracked isCandidateEditModalOpen = false;

  @action
  toggleCandidateEditModal() {
    this.isCandidateEditModalOpen = !this.isCandidateEditModalOpen;
  }

  @action
  async onCandidateInformationSave() {
    try {
      await this.args.certification.save({ adapterOptions: { updateJuryComment: false } });

      this.pixToast.sendSuccessNotification({ message: 'Les informations du candidat ont bien été enregistrées.' });
      this.isCandidateEditModalOpen = false;
    } catch (error) {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach((error) => {
          this.pixToast.sendErrorNotification({ message: error.detail });
        });
      } else {
        this.pixToast.sendErrorNotification({ message: error });
      }
      throw error;
    }
  }

  <template>
    <div class="certification-informations__card">
      <h2 class="certification-informations__card__title">Candidat</h2>
      <div class="certification-info-field">
        <span>Prénom :</span>
        <span>{{@certification.firstName}}</span>
      </div>
      <div class="certification-info-field">
        <span>Nom de famille :</span>
        <span>{{@certification.lastName}}</span>
      </div>
      <div class="certification-info-field">
        <span>Date de naissance :</span>
        <span>{{if
            @certification.birthdate
            (dayjsFormat @certification.birthdate "DD/MM/YYYY" allow-empty=true)
            ""
          }}</span>
      </div>
      <div class="certification-info-field">
        <span>Sexe :</span>
        <span>{{@certification.sex}}</span>
      </div>
      <div class="certification-info-field">
        <span>Commune de naissance :</span>
        <span>{{@certification.birthplace}}</span>
      </div>
      <div class="certification-info-field">
        <span>Code postal de naissance :</span>
        <span>{{@certification.birthPostalCode}}</span>
      </div>
      <div class="certification-info-field">
        <span>Code INSEE de naissance :</span>
        <span>{{@certification.birthInseeCode}}</span>
      </div>
      <div class="certification-info-field">
        <span>Pays de naissance :</span>
        <span>{{@certification.birthCountry}}</span>
      </div>

      <div class="candidate-informations__actions">
        <PixButton
          @size="small"
          @triggerAction={{this.toggleCandidateEditModal}}
          aria-label="Modifier les informations du candidat"
        >
          Modifier infos candidat
        </PixButton>
      </div>
    </div>

    <CandidateEditModal
      @onCancelButtonsClicked={{this.toggleCandidateEditModal}}
      @onFormSubmit={{this.onCandidateInformationSave}}
      @candidate={{@certification}}
      @isDisplayed={{this.isCandidateEditModalOpen}}
    />
  </template>
}
