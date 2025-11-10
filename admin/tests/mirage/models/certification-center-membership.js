import { belongsTo, Model } from 'miragejs';

export default Model.extend({
  certificationCenter: belongsTo('certificationCenter'),
  user: belongsTo('user'),
});
