import Model, { attr, belongsTo } from '@ember-data/model';

export default class CombinedCourseItem extends Model {
  @attr('string') title;
  @attr('string') reference;

  get route() {
    return 'campaigns';
  }

  @belongsTo('combined-course', { async: false, inverse: 'items' }) combinedCourse;
}
