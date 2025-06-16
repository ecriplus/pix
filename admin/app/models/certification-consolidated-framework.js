import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class CertificationConsolidatedFramework extends Model {
  @belongsTo('complementary-certification', { async: false, inverse: null }) complementaryCertification;
  @hasMany('tubes', { async: false, inverse: null }) tubes;
}
