import Model, { attr, hasMany } from '@ember-data/model';
import sortBy from 'lodash/sortBy';

export default class Competence extends Model {
  @attr() name;
  @attr() index;

  @hasMany('thematic', { async: true, inverse: null }) thematics;

  get sortedThematics() {
    return sortBy(this.hasMany('thematics').value(), 'index');
  }
}
