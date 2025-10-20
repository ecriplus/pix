import { get } from '@ember/helper';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import isEmpty from 'lodash/isEmpty';
import MarkdownToHtml from 'mon-pix/components/markdown-to-html';
import FormattedSolution from 'mon-pix/components/solution-panel/formatted-solution';
import labeledCheckboxes from 'mon-pix/utils/labeled-checkboxes';
import proposalsAsArray from 'mon-pix/utils/proposals-as-array';
import { pshuffle } from 'mon-pix/utils/pshuffle';
import valueAsArrayOfBoolean from 'mon-pix/utils/value-as-array-of-boolean';

export default class QcuSolutionPanel extends Component {
  <template>
    <div class="qcu-solution-panel rounded-panel rounded-panel__row">
      {{#each this.labeledRadios as |labeledItemRadio|}}
        <p class="qcu-solution-panel__proposal-item">
          <span class="qcu-solution-panel__radio-button">
            {{#if labeledItemRadio.checked}}
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 18 18"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>{{t "pages.comparison-window.results.tips.your-answer"}}</title>
                <g stroke="none" stroke-width="1" fill="grey" fill-rule="evenodd">
                  <circle id="Oval" stroke="#7D808B" stroke-width="2" cx="9" cy="9" r="8"></circle>
                </g>
              </svg>
            {{else}}
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 18 18"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>{{t "pages.comparison-window.results.tips.other-proposition"}}</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <circle id="Oval" stroke="#7D808B" stroke-width="2" cx="9" cy="9" r="8"></circle>
                </g>
              </svg>
            {{/if}}
          </span>
          <MarkdownToHtml
            @class="qcu-solution-panel__proposition"
            data-goodness="{{if (get this.solutionArray labeledItemRadio.index) 'good' 'bad'}}"
            data-checked={{if labeledItemRadio.checked "yes" "no"}}
            @markdown="{{labeledItemRadio.label}}"
          />
        </p>
      {{/each}}

      {{#if this.isAnswerValid}}
        <div data-test-correct-answer>
          <p class="qcu-solution-answer-feedback__expected-answer">
            {{t "pages.comparison-window.results.feedback.correct"}}
          </p>
        </div>
      {{else}}
        <FormattedSolution
          class="qcu-solution-answer-feedback__expected-answer"
          @solutionToDisplay="{{t
            'pages.comparison-window.results.feedback.wrong'
            htmlSafe=true
          }} {{this.solutionAsText}}"
        />
      {{/if}}
    </div>
  </template>

  get solutionArray() {
    const solution = this.args.solution;
    return !isEmpty(solution) ? valueAsArrayOfBoolean(solution) : [];
  }

  get solutionAsText() {
    if (!this.args.solution) {
      return '';
    }
    if (this.args.solutionToDisplay) {
      return this.args.solutionToDisplay;
    }

    return this.labeledRadios.find(({ value }) => value == this.args.solution).label;
  }

  get labeledRadios() {
    const answer = this.args.answer.value;
    let radiosArray = [];
    if (!isEmpty(answer)) {
      const proposals = this.args.challenge.get('proposals');
      const proposalsArray = proposalsAsArray(proposals);
      const answerArray = valueAsArrayOfBoolean(answer);
      radiosArray = labeledCheckboxes(proposalsArray, answerArray);
      if (this.args.challenge.get('shuffled')) {
        pshuffle(radiosArray, this.args.answer.assessment.get('id'));
      }
    }

    return radiosArray;
  }

  get isAnswerValid() {
    if (!this.args.answer) {
      return false;
    }
    return this.args.solution === this.args.answer.value;
  }
}
