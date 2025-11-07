import Model, { attr } from '@ember-data/model';

export default class CertificationVersion extends Model {
  @attr('string') scope;
  @attr('date') startDate;
  @attr('date') expirationDate;
  @attr('number') assessmentDuration;
  @attr() globalScoringConfiguration;
  @attr() competencesScoringConfiguration;
  @attr() challengesConfiguration;
}
