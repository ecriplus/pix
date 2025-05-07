import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class LevelsPerCompetence extends Model {
  @attr('string') index;
  @attr('number') maxLevel;
  @attr('number') meanLevel;
  @attr('string') name;
  @attr('string') description;

  @belongsTo('campaign-analysis-by-tubes-and-competence', { async: false, inverse: null })
  campaignAnalysisBytubesAndCompetences;
  @hasMany('levels-per-tube', { async: false, inverse: null }) levelsPerTube;
}
