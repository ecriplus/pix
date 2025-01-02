import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { eq } from 'ember-truth-helpers';

export default class ChallengeWebComponent extends Component {
  @action
  handleAnswer(event) {
    this.args.setAnswerValue(event.detail[0]);
  }

  <template>
    {{#if (eq @tagName "qcu-image")}}
      <qcu-image props={{@props}} {{on "answer" this.handleAnswer}} />
    {{/if}}
  </template>
}
