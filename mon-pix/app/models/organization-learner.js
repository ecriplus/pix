import Model, { attr } from '@ember-data/model';

export default class OrganizationLearner extends Model {
  @attr('string') code;
  @attr() reconciliationInfos;
}
