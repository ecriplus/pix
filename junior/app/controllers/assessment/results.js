import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class Missions extends Controller {
  get validatedObjectives() {
    return this.model.mission.validatedObjectives?.split('\n') ?? [];
  }

  get resultMessage() {
    return 'pages.missions.end-page.result.' + this.model.assessment.result.global;
  }

  get robotMood() {
    switch (this.model.assessment.result.global) {
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

  @action
  isStepSuccessFul(stepIndex) {
    return this.model.assessment.result.steps?.[stepIndex] === 'reached';
  }

  get resultsTitle() {
    let titleBaseTranslationKey = 'pages.missions.end-page.details-list';
    if (this.model.assessment.result.global === 'exceeded' || this.model.assessment.result.global === 'reached') {
      titleBaseTranslationKey += '.' + 'successful';
    } else {
      titleBaseTranslationKey += '.' + 'need-progress';
    }
    return titleBaseTranslationKey;
  }
}
