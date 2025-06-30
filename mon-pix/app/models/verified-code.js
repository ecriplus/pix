import Model, { belongsTo } from '@ember-data/model';

export default class VerifiedCode extends Model {
  @belongsTo('campaign', { async: true, inverse: null }) campaign;
}
