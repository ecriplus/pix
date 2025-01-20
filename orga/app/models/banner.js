import Model, { attr } from '@ember-data/model';

export default class Banner extends Model {
  @attr() severity;
  @attr() message;
}
