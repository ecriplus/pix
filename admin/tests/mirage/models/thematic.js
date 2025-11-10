import { hasMany, Model } from 'miragejs';

export default Model.extend({
  triggerTubes: hasMany('triggerTube'),
  tubes: hasMany('tube'),
});
