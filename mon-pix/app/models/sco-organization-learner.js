import Model, { attr } from '@ember-data/model';

export default class ScoOrganizationLearner extends Model {
  @attr('date-only') birthdate;
  @attr('number') organizationId;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') username;
}
