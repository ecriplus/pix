import Model, { attr, hasMany } from '@ember-data/model';

export default class CertificationConsolidatedFramework extends Model {
  @attr('string') scope;
  @hasMany('area', { async: true, inverse: null }) areas;
  @hasMany('tube', { async: false, inverse: null }) tubes;
}
