import Model, { attr } from '@ember-data/model';

export default class CertificationCandidateSubscription extends Model {
  @attr sessionId;
  @attr enrolledDoubleCertificationLabel;
  @attr doubleCertificationEligibility;

  get displaySubscriptionInformation() {
    return this.enrolledDoubleCertificationLabel;
  }

  get isEligibleToDoubleCertification() {
    return this.enrolledDoubleCertificationLabel && this.doubleCertificationEligibility;
  }
}
