import Model, { attr } from '@ember-data/model';

export default class CertificationCandidateSubscription extends Model {
  // eslint-disable-next-line ember/no-empty-attrs
  @attr sessionId;
  // eslint-disable-next-line ember/no-empty-attrs
  @attr enrolledDoubleCertificationLabel;
  // eslint-disable-next-line ember/no-empty-attrs
  @attr doubleCertificationEligibility;

  get displaySubscriptionInformation() {
    return this.enrolledDoubleCertificationLabel;
  }

  get isEligibleToDoubleCertification() {
    return this.enrolledDoubleCertificationLabel && this.doubleCertificationEligibility;
  }
}
