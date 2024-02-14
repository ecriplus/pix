import Model, { attr, hasMany } from '@ember-data/model';

export default class Competence extends Model {
  @attr('string') name;
  @attr('string') index;

  @hasMany('thematic') thematics;

  get sortedThematics() {
    return this.thematics.slice().sort((a, b) => {
      return a.index - b.index;
    });
  }
}
