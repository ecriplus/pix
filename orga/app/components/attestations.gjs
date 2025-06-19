import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixMultiSelect from '@1024pix/pix-ui/components/pix-multi-select';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { and, eq } from 'ember-truth-helpers';

import PageTitle from './ui/page-title';

export const SIXTH_GRADE_ATTESTATION_KEY = 'SIXTH_GRADE';
export const PARENTHOOD_ATTESTATION_KEY = 'PARENTHOOD';

export default class Attestations extends Component {
  @service currentUser;

  get displaySixthGrade() {
    return (
      this.currentUser.prescriber.availableAttestations.includes(SIXTH_GRADE_ATTESTATION_KEY) &&
      this.args.divisions != undefined
    );
  }

  get availableAttestations() {
    if (this.displaySixthGrade) {
      const attestations = this.currentUser.prescriber.availableAttestations.filter(
        (attestation) => attestation != SIXTH_GRADE_ATTESTATION_KEY,
      );
      return attestations;
    }
    return this.currentUser.prescriber.availableAttestations;
  }

  get displayAttestations() {
    return this.availableAttestations.length > 0;
  }

  <template>
    <PageTitle>
      <:title>{{t "pages.attestations.title"}}</:title>
    </PageTitle>

    {{#if this.displaySixthGrade}}
      <SixthGrade @divisions={{@divisions}} @onSubmit={{@onSubmit}} />
    {{/if}}

    {{#if (and this.displaySixthGrade this.displayAttestations)}}
      <div class="attestations-page__separator" />
    {{/if}}

    {{#if this.displayAttestations}}
      <OtherAttestations @attestations={{this.availableAttestations}} @onSubmit={{@onSubmit}} />
    {{/if}}
  </template>
}

class OtherAttestations extends Component {
  @service intl;
  @tracked selectedAttestation = null;

  get options() {
    return this.args.attestations.map((attestation) => ({
      value: attestation,
      label: this.intl.t('pages.attestations.' + attestation),
    }));
  }

  @action
  onSubmit(event) {
    event.preventDefault();

    this.args.onSubmit(this.selectedAttestation, []);
    this.selectedAttestation = null;
  }

  @action
  onSelectedAttestationChange(value) {
    if (value === '') {
      this.selectedAttestation = null;
    } else {
      this.selectedAttestation = value;
    }
  }

  <template>
    <div>
      <p class="attestations-page__text">
        {{t "pages.attestations.basic-description"}}
      </p>
      <form class="attestations-page__action" {{on "submit" this.onSubmit}}>
        <PixSelect
          @value={{this.selectedAttestation}}
          @options={{this.options}}
          @onChange={{this.onSelectedAttestationChange}}
          @placeholder={{t "common.filters.placeholder"}}
        >
          <:label>{{t "pages.attestations.select-label"}}</:label>
        </PixSelect>
        <PixButton
          @type="submit"
          @isDisabled={{eq this.selectedAttestation null}}
          @triggerAction={{this.onSubmit}}
          @size="small"
        >
          {{t "pages.attestations.download-attestations-button"}}
        </PixButton>
      </form>
    </div>
  </template>
}

class SixthGrade extends Component {
  @tracked selectedDivisions = [];
  @tracked isLoading = false;

  @action
  async onSubmit() {
    this.isLoading = true;
    await this.args.onSubmit(SIXTH_GRADE_ATTESTATION_KEY, this.selectedDivisions);
    this.isLoading = false;
  }

  @action
  onSelectDivision(value) {
    this.selectedDivisions = value;
  }

  get isDisabled() {
    return !this.selectedDivisions.length || this.isLoading;
  }

  <template>
    <p class="attestations-page__text">
      {{t "pages.attestations.divisions-description"}}
    </p>
    <div class="attestations-page__action">
      <PixMultiSelect
        @isSearchable={{true}}
        @options={{@divisions}}
        @values={{this.selectedDivisions}}
        @onChange={{this.onSelectDivision}}
        @placeholder={{t "common.filters.placeholder"}}
      >
        <:label>{{t "pages.attestations.select-divisions-label"}}</:label>
        <:default as |option|>{{option.label}}</:default>
      </PixMultiSelect>
      <PixButton @triggerAction={{this.onSubmit}} @size="small" @isDisabled={{this.isDisabled}}>
        {{t "pages.attestations.download-attestations-button"}}
      </PixButton>
    </div>
  </template>
}
