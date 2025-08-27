import Model, { attr } from '@ember-data/model';

export default class ParticipationStatistic extends Model {
  @attr('number') totalParticipationCount;
  @attr('number') completedParticipationCount;
  @attr('number') sharedParticipationCountLastThirtyDays;
}
