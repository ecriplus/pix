import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import AdministrationBlockLayout from '../../block-layout';
import Form from './form';

export default class FlashAlgorithmConfiguration extends Component {
  @service store;
  @service pixToast;
  @tracked form = {
    maximumAssessmentLength: this.args.model.maximumAssessmentLength,
    challengesBetweenSameCompetence: this.args.model.challengesBetweenSameCompetence,
    variationPercent: this.args.model.variationPercent,
    limitToOneQuestionPerTube: this.args.model.limitToOneQuestionPerTube,
    enablePassageByAllCompetences: this.args.model.enablePassageByAllCompetences,
  };

  @action
  async onCreateFlashAlgorithmConfiguration(event) {
    event.preventDefault();
    const adapter = this.store.adapterFor('flash-algorithm-configuration');
    try {
      await adapter.createRecord(this.form);
      this.pixToast.sendSuccessNotification({ message: 'La configuration a été créée' });
    } catch {
      this.pixToast.sendErrorNotification({ message: "La configuration n'a pu être créée" });
    }
  }

  @action
  updateNumberValues(event) {
    this.form = { ...this.form, [event.target.id]: event.target.value };
  }

  @action
  updateCheckboxValues(event) {
    this.form = { ...this.form, [event.target.id]: event.target.checked };
  }

  <template>
    <AdministrationBlockLayout @title={{t "pages.administration.certification.flash-algorithm-configuration.title"}}>
      <Form
        @form={{this.form}}
        @updateNumberValues={{this.updateNumberValues}}
        @updateCheckboxValues={{this.updateCheckboxValues}}
        @onCreateFlashAlgorithmConfiguration={{this.onCreateFlashAlgorithmConfiguration}}
      />

    </AdministrationBlockLayout>
  </template>
}
