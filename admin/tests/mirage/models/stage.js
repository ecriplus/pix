import { belongsTo, Model } from 'miragejs';

export default Model.extend({
  stageCollection: belongsTo('stageCollection'),
});
