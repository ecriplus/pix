import Model, { attr } from '@ember-data/model';

export default class Attestation extends Model {
  @attr('string') templateName;
  @attr('string') key;
  @attr() file;
}
