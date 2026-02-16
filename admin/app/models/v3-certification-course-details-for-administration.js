import Model, { attr, hasMany } from '@ember-data/model';
import { assessmentStates } from 'pix-admin/models/certification';

const ONE_HOUR_45_MINUTES_IN_MS = 1 * 60 * 60 * 1000 + 45 * 60 * 1000;

export const abortReasons = {
  CANDIDATE: 'candidate',
  TECHNICAL: 'technical',
};

export default class V3CertificationCourseDetailsForAdministration extends Model {
  @attr('number') certificationCourseId;
  @attr('boolean') isRejectedForFraud;
  @attr('date') createdAt;
  @attr('date') completedAt;
  @attr('date') endedAt;
  @attr('string') assessmentResultStatus;
  @attr('string') assessmentState;
  @attr('string') abortReason;
  @attr('number') pixScore;
  @attr('number') numberOfChallenges;
  @hasMany('certification-challenges-for-administration', { async: true, inverse: null })
  certificationChallengesForAdministration;
  version = 3;

  get numberOfAnsweredQuestions() {
    const certificationChallengesForAdministration = this.hasMany('certificationChallengesForAdministration').value();
    if (!certificationChallengesForAdministration) return 0;
    return certificationChallengesForAdministration.filter((challenge) => {
      return challenge.answerStatus;
    }).length;
  }

  get wasFinalized() {
    return this.assessmentState === assessmentStates.ENDED_DUE_TO_FINALIZATION;
  }

  get wasEndedByInvigilator() {
    return this.assessmentState === assessmentStates.ENDED_BY_INVIGILATOR;
  }

  get numberOfOkAnswers() {
    const certificationChallengesForAdministration = this.hasMany('certificationChallengesForAdministration').value();
    if (!certificationChallengesForAdministration) return 0;
    return certificationChallengesForAdministration.filter((challenge) => challenge.isOk()).length;
  }

  get numberOfKoAnswers() {
    const certificationChallengesForAdministration = this.hasMany('certificationChallengesForAdministration').value();
    if (!certificationChallengesForAdministration) return 0;
    return certificationChallengesForAdministration.filter((challenge) => challenge.isKo()).length;
  }

  get numberOfAbandAnswers() {
    const certificationChallengesForAdministration = this.hasMany('certificationChallengesForAdministration').value();
    if (!certificationChallengesForAdministration) return 0;
    return certificationChallengesForAdministration.filter((challenge) => challenge.isAband()).length;
  }

  get numberOfValidatedLiveAlerts() {
    const certificationChallengesForAdministration = this.hasMany('certificationChallengesForAdministration').value();
    if (!certificationChallengesForAdministration) return 0;
    return certificationChallengesForAdministration.filter((challenge) => challenge.hasLiveAlert()).length;
  }

  get duration() {
    const start = new Date(this.createdAt);
    const end = new Date(this.completedAt || this.endedAt);
    return end - start;
  }

  get hasExceededTimeLimit() {
    const defaultDurationInMs = ONE_HOUR_45_MINUTES_IN_MS;
    return this.duration > defaultDurationInMs;
  }

  get hasNotBeenCompletedByCandidate() {
    return [assessmentStates.ENDED_BY_INVIGILATOR, assessmentStates.ENDED_DUE_TO_FINALIZATION].includes(
      this.assessmentState,
    );
  }
}
