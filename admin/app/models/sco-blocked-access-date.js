import Model, { attr } from '@ember-data/model';

export default class ScoBlockedAccessDate extends Model {
  @attr('string') scoOrganizationType;
  @attr('date') reopeningDate;
}
