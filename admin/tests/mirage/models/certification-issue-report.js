import { belongsTo, Model } from 'miragejs';

export default Model.extend({
  certification: belongsTo('certification'),
});
