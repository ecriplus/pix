import { belongsTo, Model } from 'miragejs';

export default Model.extend({
  tube: belongsTo('tube'),
});
