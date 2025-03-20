import Model, { attr } from '@ember-data/model';

export default class FeatureToggle extends Model {
  @attr('boolean') isTextToSpeechButtonEnabled;
  @attr('boolean') showNewCampaignPresentationPage;
  @attr('boolean') isPixAppNewLayoutEnabled;
  @attr('boolean') isPixCompanionEnabled;
  @attr('boolean') isQuestEnabled;
  @attr('boolean') isModalSentResultEnabled;
}
