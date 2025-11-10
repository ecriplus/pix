import { belongsTo, hasMany, Model } from 'miragejs';

export default Model.extend({
  stageCollection: belongsTo('stageCollection'),
  badges: hasMany('badge'),
  trainingSummaries: hasMany('trainingSummary'),
  areas: hasMany('area'),
});
