import Model, { attr, belongsTo } from '@ember-data/model';

export default class CombinedCourseItem extends Model {
  @attr('string') reference;
  @attr('string') title;
  @attr('string') type;
  @attr('string') redirection;
  @attr('boolean') isCompleted;
  @attr('boolean') isLocked;
  @attr('number') duration;

  get route() {
    return this.type === 'CAMPAIGN' ? 'campaigns' : 'module';
  }

  @belongsTo('combined-course', { async: false, inverse: 'items' }) combinedCourse;
}
