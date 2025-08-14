import Model, { attr, belongsTo } from '@ember-data/model';

export default class Section extends Model {
  @attr('string') type;
  @attr({ defaultValue: () => [] }) grains;

  @belongsTo('module', { async: false, inverse: 'sections' }) module;
}
