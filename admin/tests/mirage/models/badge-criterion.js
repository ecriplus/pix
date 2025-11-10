import { belongsTo, Model } from 'miragejs';

export default Model.extend({
  badge: belongsTo('badge'),
});
