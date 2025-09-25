import Model, { attr } from '@ember-data/model';

export default class AdministrationTeam extends Model {
  @attr('string') name;
}
