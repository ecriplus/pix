import {
  RESTRICTED_OIDC_PROVIDERS,
  UserAccountInfo,
} from '../../../../../src/identity-access-management/domain/models/UserAccountInfo.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Domain | Models | UserAccountInfo', function () {
  beforeEach(function () {
    RESTRICTED_OIDC_PROVIDERS.list = ['RESTRICTED_OIDC_PARTNER_1', 'RESTRICTED_OIDC_PARTNER_2'];
  });

  describe('constructor', function () {
    it('creates a user account info with required properties and sets default values for optional properties', function () {
      // given
      const userAccountInfoData = {
        id: 123,
        email: 'user@example.net',
        username: 'user123',
        canSelfDeleteAccount: true,
      };

      // when
      const userAccountInfo = new UserAccountInfo(userAccountInfoData);

      // then
      expect(userAccountInfo.id).to.equal(123);
      expect(userAccountInfo.email).to.equal('user@example.net');
      expect(userAccountInfo.username).to.equal('user123');
      expect(userAccountInfo.canSelfDeleteAccount).to.be.true;
      expect(userAccountInfo.canAddEmailConnectionMethod).to.be.false;
    });
  });

  describe('#canAddEmailConnectionMethod', function () {
    context('when addEmailConnectionMethodEnabled feature toggle is false', function () {
      it('canAddEmailConnectionMethod returns false', function () {
        // given
        const userAccountInfo = new UserAccountInfo({
          id: 123,
          email: null,
          username: 'user123',
          canSelfDeleteAccount: true,
          addEmailConnectionMethodEnabled: false,
          oidcAuthenticationMethods: [{ identityProvider: 'OIDC_PARTNER' }],
        });

        // when / then
        expect(userAccountInfo.canAddEmailConnectionMethod).to.be.false;
      });
    });

    context('when addEmailConnectionMethodEnabled is true', function () {
      context('when user already has an email', function () {
        it('canAddEmailConnectionMethod returns false', function () {
          // given
          const userAccountInfo = new UserAccountInfo({
            id: 123,
            email: 'user@example.net',
            username: 'user123',
            canSelfDeleteAccount: true,
            addEmailConnectionMethodEnabled: true,
            oidcAuthenticationMethods: [{ identityProvider: 'AUTHORIZED_OIDC_PARTNER' }],
          });

          // when / then
          expect(userAccountInfo.canAddEmailConnectionMethod).to.be.false;
        });
      });

      context('when user has no email', function () {
        context('when oidcAuthenticationMethods is empty', function () {
          it('canAddEmailConnectionMethod returns false', function () {
            // given
            const userAccountInfo = new UserAccountInfo({
              id: 123,
              email: null,
              username: 'user123',
              canSelfDeleteAccount: true,
              addEmailConnectionMethodEnabled: true,
              oidcAuthenticationMethods: [],
            });

            // when / then
            expect(userAccountInfo.canAddEmailConnectionMethod).to.be.false;
          });
        });

        context('when all oidcAuthenticationMethods are restricted SSO providers', function () {
          it('canAddEmailConnectionMethod returns false', function () {
            // given
            const userAccountInfo = new UserAccountInfo({
              id: 123,
              email: null,
              username: 'user123',
              canSelfDeleteAccount: true,
              addEmailConnectionMethodEnabled: true,
              oidcAuthenticationMethods: [
                { identityProvider: 'RESTRICTED_OIDC_PARTNER_1' },
                { identityProvider: 'RESTRICTED_OIDC_PARTNER_2' },
              ],
            });

            // when / then
            expect(userAccountInfo.canAddEmailConnectionMethod).to.be.false;
          });
        });

        context('when at least one oidcAuthenticationMethod is not a restricted SSO provider', function () {
          it('canAddEmailConnectionMethod returns true', function () {
            // given
            const userAccountInfo = new UserAccountInfo({
              id: 123,
              email: null,
              username: 'user123',
              canSelfDeleteAccount: true,
              addEmailConnectionMethodEnabled: true,
              oidcAuthenticationMethods: [
                { identityProvider: 'OIDC_PARTNER' },
                { identityProvider: 'RESTRICTED_OIDC_PARTNER_1' },
              ],
            });

            // when / then
            expect(userAccountInfo.canAddEmailConnectionMethod).to.be.true;
          });
        });
      });
    });
  });
});
