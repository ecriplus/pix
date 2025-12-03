import { belongsTo, hasMany, Model } from 'miragejs';

export default Model.extend({
  complementaryCertification: belongsTo('complementaryCertification'),
  areas: hasMany('area'),
  tubes: hasMany('tube'),
});
