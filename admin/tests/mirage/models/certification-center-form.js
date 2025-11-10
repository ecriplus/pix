import { hasMany, Model } from 'miragejs';

export default Model.extend({
  habilitations: hasMany('complementaryCertification'),
});
