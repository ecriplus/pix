import { belongsTo, hasMany, Model } from 'miragejs';

export default Model.extend({
  profile: belongsTo('profile'),
  userLogin: belongsTo('userLogin'),
  organizationMemberships: hasMany('organizationMembership'),
  certificationCenterMemberships: hasMany('certificationCenterMembership'),
  organizationLearners: hasMany('organizationLearner'),
  authenticationMethods: hasMany('authenticationMethod'),
  lastApplicationConnections: hasMany('lastApplicationConnection'),
  participations: hasMany('userParticipation'),
  certificationCourses: hasMany('userCertificationCourse'),
});
