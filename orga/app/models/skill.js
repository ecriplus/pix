import Model, { attr } from '@ember-data/model';

export default class Skill extends Model {
  @attr('number') difficulty;
}
