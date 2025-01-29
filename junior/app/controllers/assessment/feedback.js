import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class FeedBack extends Controller {
  @service router;
  @service intl;

  get feedbackClassName() {
    if (this.model.assessment?.result?.global === 'exceeded' || this.model.assessment?.result?.global === 'reached') {
      return 'feedback--success';
    } else {
      return 'feedback';
    }
  }

  get buttonLabel() {
    const translationKeyArray = `pages.missions.feedback.result.${this.model.assessment?.result?.global ?? 'not-reached'}.button-label`;

    return this.intl.t(translationKeyArray);
  }

  get robotMood() {
    switch (this.model.assessment?.result?.global) {
      case 'exceeded':
        return 'happy';
      case 'reached':
        return 'proud';
      case 'not-reached':
        return 'retry';
      default:
        return 'default';
    }
  }

  get robotFeedBackMessage() {
    const translationKeyArray = `pages.missions.feedback.result.${this.model.assessment?.result?.global ?? 'not-reached'}.robot-text`;

    return [this.intl.t(translationKeyArray + '.0'), this.intl.t(translationKeyArray + '.1')];
  }

  @action
  routeUrl() {
    const sessionId = this.model.assessment?.id;
    const routeName = 'assessment.results';
    this.router.transitionTo(routeName, sessionId);
  }
}
