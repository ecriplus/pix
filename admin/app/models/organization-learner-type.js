import Model, { attr } from '@ember-data/model';

export default class OrganizationLearnerType extends Model {
  @attr('string') name;
}
