import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ModuleElement extends Component {
  @service modulixPreviewMode;

  @tracked shouldDisplayRequiredMessage = false;
  @tracked isOnRetryMode = false;

  get element() {
    return this.args.element;
  }

  get answerIsValid() {
    return this.correction?.isOk;
  }

  get disableInput() {
    return !this.isOnRetryMode && !!this.correction;
  }

  get correction() {
    if (this.isOnRetryMode) {
      return null;
    }
    return this.args.correction;
  }

  get shouldDisplayFeedback() {
    return !this.isOnRetryMode && !!this.correction;
  }

  get shouldDisplayRetryButton() {
    return this.shouldDisplayFeedback && this.correction?.isKo;
  }

  get userResponse() {
    throw new Error('ModuleElement.userResponse not implemented');
  }

  get canValidateElement() {
    throw new Error('ModuleElement.canValidateElement not implemented');
  }

  get hasShortProposals() {
    if (!this.element.hasShortProposals || this.modulixPreviewMode.isEnabled) {
      return 'proposals';
    }
    const isNumberOfProposalsOdd = this.element.proposals.length === 3;
    return isNumberOfProposalsOdd ? '3-short-proposals' : 'short-proposals';
  }

  resetAnswers() {
    throw new Error('ModuleElement.resetAnswers not implemented');
  }

  @action
  retry(event) {
    const retryButton = event.currentTarget;
    const form = retryButton.form;

    this.isOnRetryMode = true;
    this.resetAnswers();
    form.reset();

    this.args.onRetry({ element: this.element });
  }

  @action
  async onAnswer(event) {
    event.preventDefault();
    this.shouldDisplayRequiredMessage = !this.canValidateElement;
    if (this.shouldDisplayRequiredMessage === true) {
      return;
    }
    this.isOnRetryMode = false;
    const answerData = { userResponse: this.userResponse, element: this.element };
    await this.args.onAnswer(answerData);
  }
}
