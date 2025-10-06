import Model, { attr } from '@ember-data/model';

export default class CombinedCourseStatistic extends Model {
  @attr('number') participationsCount;
  @attr('number') completedParticipationsCount;
}
