import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import AdministrationBlockLayout from '../../block-layout';
import Form from './form';

export default class CertificationVersionChallengesConfiguration extends Component {
  @service pixToast;

  @tracked form = {
    maximumAssessmentLength: Number(this.args.model.challengesConfiguration?.maximumAssessmentLength),
    challengesBetweenSameCompetence: Number(this.args.model.challengesConfiguration?.challengesBetweenSameCompetence),
    variationPercent: Number(this.args.model.challengesConfiguration?.variationPercent) * 100,
    limitToOneQuestionPerTube: this.args.model.challengesConfiguration?.limitToOneQuestionPerTube,
    enablePassageByAllCompetences: this.args.model.challengesConfiguration?.enablePassageByAllCompetences,
  };

  @action
  async onSave(event) {
    event.preventDefault();
    try {
      this.args.model.challengesConfiguration = {
        maximumAssessmentLength: this.form.maximumAssessmentLength,
        challengesBetweenSameCompetence: this.form.challengesBetweenSameCompetence,
        variationPercent: this.form.variationPercent / 100,
        limitToOneQuestionPerTube: this.form.limitToOneQuestionPerTube,
        enablePassageByAllCompetences: this.form.enablePassageByAllCompetences,
      };
      await this.args.model.save();
      this.pixToast.sendSuccessNotification({ message: 'La configuration a été mise à jour' });
    } catch {
      this.pixToast.sendErrorNotification({ message: "La configuration n'a pu être mise à jour" });
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
    <AdministrationBlockLayout
      @title={{t "pages.administration.certification.certification-version-challenges-configuration.title"}}
    >
      <Form
        @form={{this.form}}
        @updateNumberValues={{this.updateNumberValues}}
        @updateCheckboxValues={{this.updateCheckboxValues}}
        @onSave={{this.onSave}}
      />

    </AdministrationBlockLayout>
  </template>
}
