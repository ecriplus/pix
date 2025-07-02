import Model, { attr } from '@ember-data/model';

export default class AttestationParticipantStatus extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') division;
  @attr('date') obtainedAt;
}
