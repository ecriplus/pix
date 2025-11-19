import Model, { attr } from '@ember-data/model';

export default class ScoBlockedAccessDate extends Model {
  @attr('date') reopeningDate;
}
