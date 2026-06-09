import Model, { attr, hasMany } from '@ember-data/model';

export default class TargetProfileOverview extends Model {
  @attr('string') name;
  @attr('string') description;
  @attr('number') tubeCount;
  @attr('number') thematicResultCount;
  @attr('boolean') hasStage;
  @attr('string') category;
  @attr('boolean') areKnowledgeElementsResettable;
  @attr('boolean') isSimplifiedAccess;

  @hasMany('framework', { async: false, inverse: null }) frameworks;
  @hasMany('badge', { async: false, inverse: null }) badges;
}
