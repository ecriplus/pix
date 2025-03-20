import Model, { attr } from '@ember-data/model';

export default class LastApplicationConnection extends Model {
  @attr() application;
  @attr() lastLoggedAt;
}
