import Model, { attr } from '@ember-data/model';

export default class Course extends Model {
  @attr('string') name;
  @attr('string') type;
  @attr('number') nbTubes;
  @attr('number') nbModules;
  @attr('string') category;
  @attr('boolean') isSimplifiedAccess;
  @attr({ defaultValue: () => [] }) areas;
  @attr({ defaultValue: () => [] }) competences;
}
