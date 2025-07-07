import Model, { attr } from '@ember-data/model';

export default class CombinedCourse extends Model {
  @attr('string') name;
}
