import Model, { attr } from '@ember-data/model';

export default class FeatureToggle extends Model {
  @attr('boolean') isTextToSpeechButtonEnabled;
  @attr('boolean') isQuestEnabled;
  @attr('boolean') isAutoShareEnabled;
  @attr('boolean') useLocale;
}
