import Model, { attr } from '@ember-data/model';

export default class CombinedCourseParticipation extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') status;
}
