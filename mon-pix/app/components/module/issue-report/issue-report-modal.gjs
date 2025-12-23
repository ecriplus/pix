import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import PixTextarea from '@1024pix/pix-ui/components/pix-textarea';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import InElement from 'mon-pix/components/in-element';

import { categoriesKey } from '../../../models/module-issue-report';

const defaultCategories = [
  {
    value: categoriesKey.ACCESSIBILITY_ISSUE,
    label: 'pages.modulix.issue-report.modal.categories.default.accessibility-issue',
  },
  {
    value: categoriesKey.OTHER,
    label: 'pages.modulix.issue-report.modal.categories.default.other',
  },
];

const feedbackCategories = [
  {
    value: categoriesKey.QUESTION_ISSUE,
    label: 'pages.modulix.issue-report.modal.categories.feedback.question-issue',
  },
  {
    value: categoriesKey.RESPONSE_ISSUE,
    label: 'pages.modulix.issue-report.modal.categories.feedback.response-issue',
  },
  {
    value: categoriesKey.IMPROVEMENT,
    label: 'pages.modulix.issue-report.modal.categories.feedback.improvement',
  },
  ...defaultCategories,
];

const customAndEmbedTypes = ['custom', 'custom-draft', 'embed'];

const customAndEmbedCategories = [
  {
    value: categoriesKey.INSTRUCTION_ISSUE,
    label: 'pages.modulix.issue-report.modal.categories.custom-and-embed.instruction-issue',
  },
  {
    value: categoriesKey.EMBED_NOT_WORKING,
    label: 'pages.modulix.issue-report.modal.categories.custom-and-embed.embed-not-working',
  },
  ...defaultCategories,
];

export default class ModulixIssueReportModal extends Component {
  @service intl;

  @tracked selectedCategory = this.categories[0].value;
  @tracked comment = null;
  @tracked errorMessage = null;

  get categories() {
    let categories;

    if (customAndEmbedTypes.includes(this.args.elementType)) {
      categories = customAndEmbedCategories;
    } else {
      categories = feedbackCategories;
    }

    return categories.map(({ value, label }) => ({
      value,
      label: this.intl.t(label),
    }));
  }

  @action
  hideModal() {
    this.resetForm();
    this.args.hideModal();
  }

  @action onChangeCategory(value) {
    this.selectedCategory = value;
  }

  @action onChangeComment(event) {
    this.errorMessage = null;
    this.comment = event?.target?.value.trim();
  }

  @action
  sendReport() {
    if (!this.comment) {
      this.errorMessage = this.intl.t('pages.modulix.issue-report.error-messages.missing-comment');
      return;
    }
    this.args.onSendReport({ categoryKey: this.selectedCategory, comment: this.comment });
    this.hideModal();
  }

  @action
  resetForm() {
    document.getElementById('module-issue-report-form').reset();
    this.selectedCategory = this.categories[0].value;
    this.comment = null;
  }

  <template>
    <InElement @destinationId="modal-container">
      <PixModal
        class="issue-report-modal"
        @title={{t "pages.modulix.issue-report.modal.title"}}
        @onCloseButtonClick={{this.hideModal}}
        @showModal={{@showModal}}
      >
        <:content>
          <p class="issue-report-modal__mandatory">
            {{t "common.form.mandatory-all-fields"}}
          </p>

          <form class="issue-report-modal-form" id="module-issue-report-form">
            <fieldset class="issue-report-modal-form__fieldset">
              <legend class="sr-only">{{t "pages.modulix.issue-report.modal.legend"}}</legend>
              <PixSelect
                @hideDefaultOption={{true}}
                @options={{this.categories}}
                @value={{this.selectedCategory}}
                @onChange={{this.onChangeCategory}}
                required
              >
                <:label>{{t "pages.modulix.issue-report.modal.select-label"}}</:label>
              </PixSelect>
              <PixTextarea
                class="issue-report-modal-form__comment"
                @maxlength="200"
                rows="5"
                required
                aria-required="true"
                placeholder={{t "pages.modulix.issue-report.modal.textarea-placeholder"}}
                {{on "input" this.onChangeComment}}
              >
                <:label>{{t "pages.modulix.issue-report.modal.textarea-label"}}</:label>
              </PixTextarea>
            </fieldset>
          </form>

          {{#if this.errorMessage}}
            <PixNotificationAlert @type="error" class="issue-report-modal__error-message">
              {{this.errorMessage}}
            </PixNotificationAlert>
          {{/if}}
        </:content>
        <:footer>
          <ul class="issue-report-modal-form__action-buttons">
            <li><PixButton @variant="secondary" @triggerAction={{this.hideModal}}>{{t
                  "common.actions.cancel"
                }}</PixButton></li>
            <li><PixButton @triggerAction={{this.sendReport}}>{{t "common.actions.send"}}</PixButton></li>
          </ul>
        </:footer>
      </PixModal>
    </InElement>
  </template>
}
