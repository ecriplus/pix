import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CombinedCourse extends Model {
  @attr('string') name;
  @attr('string') code;
  @attr({ defaultValue: () => [] }) campaignIds;
  @hasMany('combined-course-participation', { async: true, inverse: null }) combinedCourseParticipations;
  @belongsTo('combined-course-statistic', { async: true, inverse: null }) combinedCourseStatistics;
}
