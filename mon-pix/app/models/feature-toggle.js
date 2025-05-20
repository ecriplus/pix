import Model, { attr } from '@ember-data/model';

export default class FeatureToggle extends Model {
  @attr('boolean') isTextToSpeechButtonEnabled;
  @attr('boolean') isPixAppNewLayoutEnabled;
  @attr('boolean') isQuestEnabled;
  @attr('boolean') isV3CertificationPageEnabled;
  @attr('boolean') isNewAccountRecoveryEnabled;
}
