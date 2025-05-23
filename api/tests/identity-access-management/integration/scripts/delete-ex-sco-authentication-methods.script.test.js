import { NON_OIDC_IDENTITY_PROVIDERS } from '../../../../src/identity-access-management/domain/constants/identity-providers.js';
import { DeleteExScoAuthenticationMethodsScript } from '../../../../src/identity-access-management/scripts/delete-ex-sco-authentication-methods.script.js';
import { logger } from '../../../../src/shared/infrastructure/utils/logger.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Identity Access Management | Scripts | delete-ex-sco-authentication-methods', function () {
  describe('#handle', function () {
    const now = new Date('2024-12-30');
    let clock;
    let userId1;

    beforeEach(async function () {
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
      userId1 = databaseBuilder.factory.buildUser({ id: 100, username: 'user100' }).id;
      const userId2 = databaseBuilder.factory.buildUser({ id: 101, username: 'user101' }).id;
      const userId3 = databaseBuilder.factory.buildUser({ id: 102, username: 'user102' }).id;
      const organizationId = databaseBuilder.factory.buildOrganization({ type: 'SCO' }).id;

      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: userId1,
        externalIdentifier: null,
      });
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: userId2,
        externalIdentifier: null,
      });
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: userId3,
        externalIdentifier: null,
      });
      const campaignId = databaseBuilder.factory.buildCampaign({ id: 1234, organizationId }).id;
      databaseBuilder.factory.buildCampaignParticipation({
        userId: userId1,
        campaignId,
        createdAt: new Date('2020-05-05'),
      });
      databaseBuilder.factory.buildCampaignParticipation({
        userId: userId2,
        campaignId,
        createdAt: new Date('2024-05-05'),
      });

      databaseBuilder.factory.buildAccountRecoveryDemand({ userId: userId1, used: true, temporaryKey: 'temporary1' });
      databaseBuilder.factory.buildAccountRecoveryDemand({ userId: userId2, used: true, temporaryKey: 'temporary2' });
      databaseBuilder.factory.buildAccountRecoveryDemand({ userId: userId3, used: true, temporaryKey: 'temporary3' });

      await databaseBuilder.commit();
    });

    afterEach(async function () {
      clock.restore();
    });

    context('when dryRun is false', function () {
      it('removes former students GAR authentication methods when their last campaign participation is older than 12 months agos', async function () {
        // when
        const script = new DeleteExScoAuthenticationMethodsScript();
        await script.handle({ options: { dryRun: false }, logger });

        // then
        const formerUserGarAuthenticationMethod1 = await knex('authentication-methods').where({
          userId: userId1,
          identityProvider: NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
        });
        expect(formerUserGarAuthenticationMethod1).to.be.empty;
      });

      context('when the user has a username', function () {
        it('removes the username', async function () {
          // when
          const script = new DeleteExScoAuthenticationMethodsScript();
          await script.handle({ options: { dryRun: false }, logger });

          // then
          const formerUserGarAuthenticationMethod1 = await knex('authentication-methods').where({
            userId: userId1,
            identityProvider: NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
          });
          expect(formerUserGarAuthenticationMethod1).to.be.empty;
          const formerUserWithUsername = await knex('users').select('id', 'username').where({ id: userId1 }).first();
          expect(formerUserWithUsername.username).to.be.null;
        });
      });
    });

    context('when dryRun is true', function () {
      it('does nothing', async function () {
        // when
        const script = new DeleteExScoAuthenticationMethodsScript();
        await script.handle({ options: { dryRun: true }, logger });

        // then
        const formerUserGarAuthenticationMethod1 = await knex('authentication-methods').where({
          userId: userId1,
          identityProvider: NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
        });
        const formerUserWithUsername = await knex('users').select('id', 'username').where({ id: userId1 }).first();
        expect(formerUserGarAuthenticationMethod1.length).to.equal(1);
        expect(formerUserWithUsername.username).to.equal('user100');
      });
    });
  });
});
