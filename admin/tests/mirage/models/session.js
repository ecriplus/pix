import { belongsTo, hasMany, Model } from 'miragejs';

export default Model.extend({
  assignedCertificationOfficer: belongsTo('user'),
  juryCommentAuthor: belongsTo('user'),
  juryCertificationSummaries: hasMany('juryCertificationSummary'),
});
