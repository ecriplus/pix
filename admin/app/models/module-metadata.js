import Model, { attr } from '@ember-data/model';

export default class ModuleMetadata extends Model {
  @attr('string') title;
  @attr('string') link;
  @attr('string') duration;
}
