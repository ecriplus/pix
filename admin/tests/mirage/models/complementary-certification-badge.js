import { belongsTo, Model } from 'miragejs';

export default Model.extend({
  complementaryCertification: belongsTo('complementaryCertification'),
});
