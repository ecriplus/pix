import Model, { attr } from '@ember-data/model';

export default class CombinedCourseBlueprint extends Model {
  @attr('string') name;
}
