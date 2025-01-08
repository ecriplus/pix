import Service from '@ember/service';

export default class CurrentLearnerService extends Service {
  get learner() {
    return JSON.parse(localStorage.getItem('learner'));
  }

  setLearner(learner) {
    localStorage.setItem('learner', JSON.stringify(learner));
  }

  setHasSeenWarningModal() {
    localStorage.setItem('learner-has-seen-warning-modal', 'true');
  }

  get hasSeenWarningModal() {
    return !!localStorage.getItem('learner-has-seen-warning-modal');
  }

  remove() {
    localStorage.removeItem('learner');
    localStorage.removeItem('learner-has-seen-warning-modal');
  }
}
