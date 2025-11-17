import Model, { attr } from '@ember-data/model';

export default class CombinedCourseParticipationDetails extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
}
