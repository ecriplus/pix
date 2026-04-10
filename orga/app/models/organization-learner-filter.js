import Model, { attr } from '@ember-data/model';

export default class OrganizationLearnerFilter extends Model {
  @attr('string') attributeName;
  @attr() values;
}
