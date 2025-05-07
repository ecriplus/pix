import Model, { attr } from '@ember-data/model';

export default class PassageEventsCollection extends Model {
  @attr('array') events;
}
