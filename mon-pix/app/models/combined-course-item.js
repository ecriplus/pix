import Model, { attr, belongsTo } from '@ember-data/model';

export default class CombinedCourseItem extends Model {
  @attr('string') title;
  @attr('string') reference;
  @attr('string') type;
  @attr('string') redirection;

  get route() {
    return this.type === 'CAMPAIGN' ? 'campaigns' : 'module';
  }

  @belongsTo('combined-course', { async: false, inverse: 'items' }) combinedCourse;
}
