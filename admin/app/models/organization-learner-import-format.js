import Model, { attr } from '@ember-data/model';

export default class OrganizationLearnerImportFormat extends Model {
  @attr('string') name;
}
