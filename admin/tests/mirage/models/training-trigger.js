import { belongsTo, hasMany, Model } from 'miragejs';

export default Model.extend({
  training: belongsTo('training'),
  areas: hasMany('area'),
});
