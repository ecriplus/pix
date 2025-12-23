import Model, { attr } from '@ember-data/model';

export default class ModuleIssueReport extends Model {
  @attr('string') moduleId;
  @attr('string') elementId;
  @attr('string') passageId;
  @attr('string') answer;
  @attr('string') categoryKey;
  @attr('string') comment;
}
