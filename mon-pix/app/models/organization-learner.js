import Model, { attr } from '@ember-data/model';

export default class OrganizationLearner extends Model {
  @attr('number') organizationId;
  // eslint-disable-next-line ember/no-empty-attrs
  @attr() reconciliationInfos;
}
