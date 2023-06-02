import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Item extends Component {
  @service store;
  @service router;
  @tracked answerHasBeenValidated = false;
  @tracked answer = null;
  @tracked answerValue = null;

  @action
  setAnswerValue(value) {
    this.answerValue = value;
  }

  _createAnswer(challenge) {
    return this.store.createRecord('answer', { challenge });
  }

  @action
  async validateAnswer() {
    this.answer = this._createAnswer(this.args.challenge);
    this.answer.value = this.answerValue;
    this.answer.assessment = this.args.assessment;
    try {
      await this.answer.save();
      this.answerHasBeenValidated = true;
    } catch (error) {
      this.answer.rollbackAttributes();
    }
  }

  @action
  skipChallenge() {
    this.setAnswerValue('#ABAND#');
    return this.validateAnswer();
  }

  @action
  resume() {
    this.answerHasBeenValidated = false;
    this.answer = null;
    this.router.transitionTo('assessment.resume');
  }
}
