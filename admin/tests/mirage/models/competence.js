import { hasMany, Model } from 'miragejs';

export default Model.extend({
  thematics: hasMany('thematic'),
});
