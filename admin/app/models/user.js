// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { computed } from '@ember/object';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

const orderedApplicationNames = ['app', 'orga', 'certif'];

const applicationLabels = {
  app: 'Pix App',
  orga: 'Pix Orga',
  certif: 'Pix Certif',
};

export default class User extends Model {
  @attr() firstName;
  @attr() lastName;
  @attr() email;
  @attr() username;
  @attr('boolean') cgu;
  @attr('boolean') pixOrgaTermsOfServiceAccepted;
  @attr('boolean') pixCertifTermsOfServiceAccepted;
  @attr() lang;
  @attr() locale;
  @attr() createdAt;
  @attr() lastTermsOfServiceValidatedAt;
  @attr() lastPixOrgaTermsOfServiceValidatedAt;
  @attr() lastPixCertifTermsOfServiceValidatedAt;
  @attr() lastLoggedAt;
  @attr() emailConfirmedAt;
  @attr() hasBeenAnonymised;
  @attr() hasBeenAnonymisedBy;
  @attr() anonymisedByFullName;
  @attr() isPixAgent;

  // includes
  @belongsTo('profile', { async: true, inverse: null }) profile;
  @belongsTo('user-login', { async: true, inverse: null }) userLogin;

  @hasMany('organization-membership', { async: true, inverse: 'user' }) organizationMemberships;
  @hasMany('certification-center-membership', { async: true, inverse: 'user' }) certificationCenterMemberships;
  @hasMany('organization-learner', { async: true, inverse: 'user' }) organizationLearners;
  @hasMany('authentication-method', { async: true, inverse: null }) authenticationMethods;
  @hasMany('last-application-connection', { async: false, inverse: null }) lastApplicationConnections;
  @hasMany('user-participation', { async: true, inverse: null }) participations;

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get language() {
    return this.lang?.toUpperCase();
  }

  get organizationMembershipCount() {
    return this.organizationMemberships.length;
  }

  get participationCount() {
    return this.participations.length;
  }

  get authenticationMethodCount() {
    return this.username && this.email ? this.authenticationMethods.length + 1 : this.authenticationMethods.length;
  }

  get orderedLastApplicationConnections() {
    const connections = orderedApplicationNames.map((applicationName) => {
      const lastLoggedAt = this.lastApplicationConnections?.find((connection) => {
        return connection.application === applicationName;
      })?.lastLoggedAt;

      return { lastLoggedAt, label: applicationLabels[applicationName] };
    });

    return connections;
  }
}
