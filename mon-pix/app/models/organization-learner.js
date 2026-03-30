import Model, { attr } from '@ember-data/model';

export default class OrganizationLearner extends Model {
  @attr('number') organizationId;
  @attr() reconciliationInfos;
}
