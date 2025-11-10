import { hasMany, Model } from 'miragejs';

export default Model.extend({
  criteria: hasMany('badgeCriterion'),
});
