import Model, { attr, hasMany } from '@ember-data/model';

export default class CombinedCourse extends Model {
  @attr('string') name;
  @attr('string') code;
  @attr() organizationId;
  @attr('string') status;

  @hasMany('combined-course-item', { async: false, inverse: 'combinedCourse' }) items;
}
