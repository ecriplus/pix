import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { or } from 'ember-truth-helpers';

import ChallengeActions from './challenge-actions';
import ChallengeEmbedSimulator from './challenge-embed-simulator';
import ChallengeItemAutoReply from './challenge-item-auto-reply';
import ChallengeItemQcm from './challenge-item-qcm';
import ChallengeItemQcu from './challenge-item-qcu';
import ChallengeItemQrocm from './challenge-item-qrocm';
import ChallengeMedia from './challenge-media';
import ChallengeWebComponent from './challenge-web-component';

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

  get shouldDisplayRebootButton() {
    return this.isRebootable && !this.args.isDisabled;
  }

  <template>
    <div class="challenge-item {{unless this.isMediaWithForm 'challenge-item--single-display'}}">
      {{#if this.hasMedia}}
        <div class="challenge-item__media {{unless this.isMediaWithForm 'challenge-item__media--single-display'}}">
          {{#if @challenge.illustrationUrl}}
            <div class="challenge-item__image">
              <ChallengeMedia @src={{@challenge.illustrationUrl}} @alt={{@challenge.illustrationAlt}} />
            </div>
          {{/if}}
          {{#if @challenge.hasValidEmbedDocument}}
            <div class="challenge-item__embed">
              <ChallengeEmbedSimulator
                @url={{@challenge.embedUrl}}
                @title={{@challenge.embedTitle}}
                @height={{@challenge.embedHeight}}
                @hideSimulator={{@isDisabled}}
                @isMediaWithForm={{this.isMediaWithForm}}
                @shouldDisplayRebootButton={{this.shouldDisplayRebootButton}}
              />
            </div>
          {{/if}}
          {{#if @challenge.hasWebComponent}}
            <div class="challenge-item__web-component">
              <ChallengeWebComponent
                @tagName={{@challenge.webComponentTagName}}
                @props={{@challenge.webComponentProps}}
                @setAnswerValue={{@setAnswerValue}}
              />
            </div>
          {{/if}}
        </div>
      {{/if}}
      <div
        class="challenge-item__proposals {{unless this.isMediaWithForm 'challenge-item__proposals--single-display'}}"
      >
        {{#if @challenge.autoReply}}
          <div class="challenge-item__autoreply">
            <ChallengeItemAutoReply @setAnswerValue={{@setAnswerValue}} />
          </div>
        {{/if}}
        {{#if (or @challenge.isQROC @challenge.isQROCM)}}
          <div class="challenge-item__qrocm">
            <ChallengeItemQrocm
              @challenge={{@challenge}}
              @setAnswerValue={{@setAnswerValue}}
              @isDisabled={{@isDisabled}}
            />
          </div>
        {{/if}}
        {{#if @challenge.isQCU}}
          <div class="challenge-item__qcu">
            <ChallengeItemQcu
              @challenge={{@challenge}}
              @setAnswerValue={{@setAnswerValue}}
              @assessment={{@assessment}}
              @isDisabled={{@isDisabled}}
            />
          </div>
        {{/if}}
        {{#if @challenge.isQCM}}
          <div class="challenge-item__qcm">
            <ChallengeItemQcm
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
