import { hasMany, Model } from 'miragejs';

export default Model.extend({
  trainingTriggers: hasMany('trainingTrigger'),
  targetProfileSummaries: hasMany('targetProfileSummary'),
});
