import { hasMany, Model } from 'miragejs';

export default Model.extend({
  stages: hasMany('stage'),
});
