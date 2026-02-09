import { hasMany, Model } from 'miragejs';

export default Model.extend({
  organizationMemberships: hasMany('organizationMembership'),
  targetProfileSummaries: hasMany('targetProfileSummary'),
  tags: hasMany('tag'),
  children: hasMany('organization'),
  organizationInvitations: hasMany('organizationInvitation'),
});
