import Model, { attr } from '@ember-data/model';

export default class AnonymisedCampaignAssessment extends Model {
  @attr('string') state;
  @attr('date') updatedAt;

  get cardStatus() {
    return 'DELETED';
  }
}
