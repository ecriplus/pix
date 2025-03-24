import Model, { attr, hasMany } from '@ember-data/model';
import sortBy from 'lodash/sortBy';

export default class Area extends Model {
  @attr() title;
  @attr() code;
  @attr() color;
  @attr() frameworkId;

  @hasMany('competence', { async: true, inverse: null }) competences;

  get sortedCompetences() {
    return sortBy(this.hasMany('competences').value(), 'index');
  }
}
