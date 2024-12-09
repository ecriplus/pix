import Service from '@ember/service';
import sinon from 'sinon';

/**
 * Stub the session service.
 *
 * @param {Object} owner - The owner object.
 * @param {Object} [sessionData={}] - The session object.
 * @param {boolean} [sessionData.isAuthenticated=false] - Indicates if the user is authenticated.
 * @param {boolean} [sessionData.isAuthenticatedByGar=false] - Indicates if the user is authenticated by GAR.
 * @param {string} [sessionData.externalUserTokenFromGar='external-user-token'] - The external user token from GAR.
 * @param {string} [sessionData.userIdForLearnerAssociation='expected-user-id'] - The expected user ID from GAR.
 * @param {string} [sessionData.source='pix'] - The source of authentication.
 * @returns {Service} The stubbed session service.
 */
export function stubSessionService(owner, sessionData = {}) {
  const isAuthenticated = sessionData.isAuthenticated || false;
  const isAuthenticatedByGar = sessionData.isAuthenticatedByGar || false;
  const externalUserTokenFromGar = sessionData.externalUserTokenFromGar || 'external-user-token';
  const userIdForLearnerAssociation = sessionData.userIdForLearnerAssociation;
  const source = isAuthenticated ? sessionData.source || 'pix' : null;

  /**
   * Stub class for the session service.
   */
  class SessionStub extends Service {
    constructor() {
      super();
      this.isAuthenticated = isAuthenticated;
      this.isAuthenticatedByGar = isAuthenticatedByGar;
      this.userIdForLearnerAssociation = userIdForLearnerAssociation;

      if (isAuthenticated) {
        this.data = { authenticated: { source } };
      } else {
        this.data = {};
      }

      if (isAuthenticatedByGar) {
        this.externalUserTokenFromGar = externalUserTokenFromGar;
      }

      this.authenticate = sinon.stub();
      this.authenticateUser = sinon.stub();
      this.requireAuthentication = sinon.stub();
      this.invalidate = sinon.stub();
      this.revokeGarExternalUserToken = sinon.stub();
      this.revokeGarAuthenticationContext = sinon.stub();
      this.requireAuthenticationAndApprovedTermsOfService = sinon.stub();
      this.setAttemptedTransition = sinon.stub();
    }
  }

  owner.register('service:session', SessionStub);
  return owner.lookup('service:session');
}

/**
 * Stub the current user service.
 *
 * @param {Object} owner - The owner object.
 * @param {Object} [userData={}] - The user object.
 * @param {boolean} [userData.isAnonymous=false] - Indicates if the user is anonymous.
 * @param {string} [userData.firstName='John'] - The first name of the user.
 * @param {string} [userData.lastName='Doe'] - The last name of the user.
 * @param {boolean} [userData.mustValidateTermsOfService=false] - Indicates if the user must validate terms of service.
 * @param {boolean} [userData.hasRecommendedTrainings=false] - Indicates if the user has recommended trainings.
 * @returns {Service} The stubbed current user service.
 */
export function stubCurrentUserService(owner, userData = {}) {
  const isAnonymous = userData.isAnonymous || false;
  const firstName = userData.firstName || 'John';
  const lastName = userData.lastName || 'Doe';
  const fullName = `${firstName} ${lastName}`;
  const mustValidateTermsOfService = userData.mustValidateTermsOfService || false;
  const hasRecommendedTrainings = userData.hasRecommendedTrainings || false;

  /**
   * Stub class for the current user service.
   */
  class CurrentUserStub extends Service {
    constructor() {
      super();
      if (isAnonymous) {
        this.user = { isAnonymous: true };
      } else {
        this.user = {
          isAnonymous: false,
          firstName,
          lastName,
          fullName,
          hasRecommendedTrainings,
          mustValidateTermsOfService,
        };
      }

      this.load = sinon.stub();
    }
  }

  owner.register('service:current-user', CurrentUserStub);
  return owner.lookup('service:current-user');
}
