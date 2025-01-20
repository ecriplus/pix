import Model, { hasMany } from '@ember-data/model';

export default class InformationBanner extends Model {
  @hasMany('banner', { async: false, inverse: null }) banners;
}
