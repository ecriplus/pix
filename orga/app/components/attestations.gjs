import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixMultiSelect from '@1024pix/pix-ui/components/pix-multi-select';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';

import PageTitle from './ui/page-title';

export default class Attestations extends Component {
  @service currentUser;

  @action
  onSubmit(event) {
    event.preventDefault();

    this.args.onSubmit([]);
  }

  <template>
    <PageTitle>
      <:title>{{t "pages.attestations.title"}}</:title>
    </PageTitle>

    {{#if (eq @divisions undefined)}}
      <div>
        <p class="attestations-page__text">
          {{t "pages.attestations.basic-description"}}
        </p>
        <PixButton @triggerAction={{this.onSubmit}} @size="small">
          {{t "pages.attestations.download-attestations-button"}}
        </PixButton>
      </div>
    {{else}}
      <SixthGrade @divisions={{@divisions}} @onSubmit={{@onSubmit}} />
    {{/if}}
  </template>
}

class SixthGrade extends Component {
  @tracked selectedDivisions = [];

  @action
  onSubmit(event) {
    event.preventDefault();

    this.args.onSubmit(this.selectedDivisions);
  }

  @action
  onSelectDivision(value) {
    this.selectedDivisions = value;
  }

  get isDisabled() {
    return !this.selectedDivisions.length;
  }

  <template>
    <p class="attestations-page__text">
      {{t "pages.attestations.divisions-description"}}
    </p>

    <form class="attestations-page__action" {{on "submit" this.onSubmit}}>
      <PixMultiSelect
        @isSearchable={{true}}
        @options={{@divisions}}
        @values={{this.selectedDivisions}}
        @onChange={{this.onSelectDivision}}
        @placeholder={{t "common.filters.placeholder"}}
      >
        <:label>{{t "pages.attestations.select-label"}}</:label>
        <:default as |option|>{{option.label}}</:default>
      </PixMultiSelect>
      <PixButton @type="submit" id="download_attestations" @size="small" @isDisabled={{this.isDisabled}}>
        {{t "pages.attestations.download-attestations-button"}}
      </PixButton>
    </form>
  </template>
}
