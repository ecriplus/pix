import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { or } from 'ember-truth-helpers';

import AutoReply from './content/auto-reply';
import ChallengeActions from './content/challenge-actions';
import ChallengeMedia from './content/challenge-media';
import EmbeddedSimulator from './content/embedded-simulator';
import EmbeddedWebComponent from './content/embedded-web-component';
import Qcm from './content/qcm';
import Qcu from './content/qcu';
import Qrocm from './content/qrocm';

export default class ChallengeContent extends Component {
  @tracked isRebootable = false;

  constructor() {
    super(...arguments);
    window.addEventListener('message', ({ data }) => {
      if (data?.from === 'pix' && data?.type === 'init') {
        this.isRebootable = !!data.rebootable;
      }
    });
  }

  get isMediaWithForm() {
    const challenge = this.args.challenge;
    return challenge.hasForm && this.hasMedia && challenge.hasType;
  }

  get hasMedia() {
    return (
      this.args.challenge.illustrationUrl ||
      this.args.challenge.hasValidEmbedDocument ||
      this.args.challenge.hasWebComponent
    );
  }

  get challengeMediaClasses() {
    const framedClass = this.args.challenge.hasWebComponent ? '' : 'challenge-content__media--framed';
    const singleDisplayClass = this.isMediaWithForm ? '' : 'challenge-content__media--single-display';

    return `challenge-content__media ${framedClass} ${singleDisplayClass}`;
  }

  get shouldDisplayRebootButton() {
    return this.isRebootable && !this.args.isDisabled;
  }

  <template>
    <div class="challenge-content {{unless this.isMediaWithForm 'challenge-content--single-display'}}">
      {{#if this.hasMedia}}
        <div class="{{this.challengeMediaClasses}}">
          {{#if @challenge.illustrationUrl}}
            <ChallengeMedia @src={{@challenge.illustrationUrl}} @alt={{@challenge.illustrationAlt}} />
          {{/if}}
          {{#if @challenge.hasValidEmbedDocument}}
            <EmbeddedSimulator
              @url={{@challenge.embedUrl}}
              @title={{@challenge.embedTitle}}
              @height={{@challenge.embedHeight}}
              @hideSimulator={{@isDisabled}}
              @isMediaWithForm={{this.isMediaWithForm}}
              @shouldDisplayRebootButton={{this.shouldDisplayRebootButton}}
            />
          {{/if}}
          {{#if @challenge.hasWebComponent}}
            <EmbeddedWebComponent
              @tagName={{@challenge.webComponentTagName}}
              @props={{@challenge.webComponentProps}}
              @setAnswerValue={{@setAnswerValue}}
            />
          {{/if}}
        </div>
      {{/if}}
      <div
        class="challenge-content__proposals
          {{unless this.isMediaWithForm 'challenge-content__proposals--single-display'}}"
      >
        {{#if @challenge.autoReply}}
          <div class="challenge-content__autoreply">
            <AutoReply @setAnswerValue={{@setAnswerValue}} />
          </div>
        {{/if}}
        {{#if (or @challenge.isQROC @challenge.isQROCM)}}
          <div class="challenge-content__qrocm">
            <Qrocm @challenge={{@challenge}} @setAnswerValue={{@setAnswerValue}} @isDisabled={{@isDisabled}} />
          </div>
        {{/if}}
        {{#if @challenge.isQCU}}
          <div class="challenge-content__qcu">
            <Qcu
              @challenge={{@challenge}}
              @setAnswerValue={{@setAnswerValue}}
              @assessment={{@assessment}}
              @isDisabled={{@isDisabled}}
            />
          </div>
        {{/if}}
        {{#if @challenge.isQCM}}
          <div class="challenge-content__qcm">
            <Qcm
              @challenge={{@challenge}}
              @setAnswerValue={{@setAnswerValue}}
              @setValidationWarning={{@setValidationWarning}}
              @assessment={{@assessment}}
              @isDisabled={{@isDisabled}}
            />
          </div>
        {{/if}}
        <div class="container__actions">
          <ChallengeActions
            @validateAnswer={{@validateAnswer}}
            @skipChallenge={{@skipChallenge}}
            @level={{@activity.level}}
            @nextAction={{@resume}}
            @isLesson={{@challenge.focused}}
            @disableCheckButton={{@disableCheckButton}}
            @disableLessonButton={{@disableLessonButton}}
            @answerHasBeenValidated={{@answerHasBeenValidated}}
          />
        </div>
      </div>
    </div>
  </template>
}
