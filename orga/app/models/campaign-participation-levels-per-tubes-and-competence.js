import Model, { attr, hasMany } from '@ember-data/model';

export default class CampaignParticipationLevelsPerTubesAndCompetence extends Model {
  @attr('number') maxReachableLevel;
  @attr('number') meanReachedLevel;
  @attr levelsPerTube;

  @hasMany('levels-per-competence', { async: false, inverse: null }) levelsPerCompetence;
}
