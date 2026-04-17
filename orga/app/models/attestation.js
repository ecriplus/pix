import Model, { attr } from '@ember-data/model';

export default class Attestations extends Model {
  @attr('string') label;
  @attr('string') key;
}
