import { hasMany, Model } from 'miragejs';

export default Model.extend({
  competences: hasMany('competence'),
});
