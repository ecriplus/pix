import { concat, get } from '@ember/helper';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import isEmpty from 'lodash/isEmpty';
import MarkdownToHtml from 'mon-pix/components/markdown-to-html';
import FormattedSolution from 'mon-pix/components/solution-panel/formatted-solution';
import labeledCheckboxes from 'mon-pix/utils/labeled-checkboxes';
import proposalsAsArray from 'mon-pix/utils/proposals-as-array';
import { pshuffle } from 'mon-pix/utils/pshuffle';
import valueAsArrayOfBoolean from 'mon-pix/utils/value-as-array-of-boolean';

export default class QcmSolutionPanel extends Component {
  <template>
    <div class="qcm-solution-panel qcm-panel__proposals rounded-panel">
      <div class="rounded-panel__row">
        {{#each this.labeledCheckboxes as |labeledCheckbox index|}}
          <p class="qcm-panel__proposal-item">
            <label class="qcm-panel__proposal-label qcm-proposal-label">

              <input
                type="checkbox"
                class="qcm-panel__proposal-checkbox"
                checked={{if labeledCheckbox.checked "checked" ""}}
                disabled="disabled"
              />

              <MarkdownToHtml
                @class="qcm-proposal-label__answer-details"
                @markdown={{labeledCheckbox.label}}
                data-goodness="{{if (get this.solutionArray (concat index)) 'good' 'bad'}}"
                data-checked={{if labeledCheckbox.checked "yes" "no"}}
              />
            </label>
          </p>
        {{/each}}
      </div>
      {{#if this.isNotCorrectlyAnswered}}
        {{#if @solutionToDisplay}}
          <div class="comparison-window-solution comparison-window-solution--with-margin">
            <span class="sr-only">{{t "pages.comparison-window.results.a11y.the-answer-was"}}</span>
            <FormattedSolution class="comparison-window-solution__text" @solutionToDisplay={{@solutionToDisplay}} />
          </div>
        {{/if}}
      {{/if}}
    </div>
  </template>

  get solutionArray() {
    const solution = this.args.solution;
    const solutionArray = !isEmpty(solution) ? valueAsArrayOfBoolean(solution, this._proposalsArray.length) : [];
    if (this.args.challenge.get('shuffled')) {
      pshuffle(solutionArray, this.args.answer.assessment.get('id'));
    }
    return solutionArray;
  }

  get isNotCorrectlyAnswered() {
    return this.args.answer.result !== 'ok';
  }

  get labeledCheckboxes() {
    const answer = this.args.answer.value;
    let checkboxes = [];
    if (!isEmpty(answer)) {
      const answerArray = valueAsArrayOfBoolean(answer);
      checkboxes = labeledCheckboxes(this._proposalsArray, answerArray);
      if (this.args.challenge.get('shuffled')) {
        pshuffle(checkboxes, this.args.answer.assessment.get('id'));
      }
    }
    return checkboxes;
  }

  get _proposalsArray() {
    const proposals = this.args.challenge.get('proposals');
    return proposalsAsArray(proposals);
  }
}
