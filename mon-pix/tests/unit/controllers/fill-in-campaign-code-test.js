import { module, test } from 'qunit';
import sinon from 'sinon';

import { stubCurrentUserService, stubSessionService } from '../../helpers/service-stubs';
import setupIntl from '../../helpers/setup-intl';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Unit | Controller | Fill in Campaign Code', function (hooks) {
  setupIntlRenderingTest(hooks);
  setupIntl(hooks);

  let controller;
  let eventStub;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:fill-in-campaign-code');
    const routerStub = { transitionTo: sinon.stub() };
    eventStub = { preventDefault: sinon.stub() };
    controller.set('router', routerStub);
    controller.set('apiErrorMessage', null);
    controller.set('campaignCode', null);
  });

  module('#startCampaign', function () {
    module('campaign does not have GAR as identity provider', function () {
      test('should not show GAR modal', async function (assert) {
        // given
        const campaignCode = 'LINKTOTHEPAST';
        const storeStub = {
          findRecord: sinon
            .stub()
            .withArgs('verified-code', campaignCode)
            .resolves({
              id: campaignCode,
              campaign: { id: 1, code: campaignCode },
            }),
          queryRecord: sinon
            .stub()
            .withArgs('organization-to-join', { code: campaignCode })
            .resolves({ identityProvider: 'FRANCEDECONNECT' }),
        };
        controller.set('store', storeStub);
        controller.set('campaignCode', campaignCode);
        stubSessionService(this.owner);

        // when
        await controller.actions.startCampaign.call(controller, eventStub);

        // then
        assert.false(controller.showGARModal);
      });
    });

    module('campaign has GAR as identity provider', function () {
      module('user is coming from GAR', function () {
        test('should not show GAR modal', async function (assert) {
          // given
          const campaignCode = 'LINKTOTHEPAST';
          const storeStub = {
            findRecord: sinon
              .stub()
              .withArgs('verified-code', campaignCode)
              .resolves({
                id: campaignCode,
                campaign: { id: 1, code: campaignCode },
              }),
            queryRecord: sinon
              .stub()
              .withArgs('organization-to-join', { code: campaignCode })
              .resolves({ identityProvider: 'GAR' }),
          };
          stubSessionService(this.owner, { isAuthenticatedByGar: true });
          controller.set('store', storeStub);
          controller.set('campaignCode', campaignCode);

          // when
          await controller.actions.startCampaign.call(controller, eventStub);

          // then
          assert.false(controller.showGARModal);
        });
      });

      module('user is not coming from GAR', function () {
        module('user is authenticated', function () {
          test('should not show GAR modal', async function (assert) {
            // given
            const campaignCode = 'LINKTOTHEPAST';
            const storeStub = {
              findRecord: sinon
                .stub()
                .withArgs('verified-code', campaignCode)
                .resolves({
                  id: campaignCode,
                  campaign: { id: 1, code: campaignCode },
                }),
              queryRecord: sinon
                .stub()
                .withArgs('organization-to-join', { code: campaignCode })
                .resolves({ identityProvider: 'GAR' }),
            };
            stubSessionService(this.owner, { isAuthenticated: true });
            controller.set('store', storeStub);
            controller.set('campaignCode', campaignCode);

            // when
            await controller.actions.startCampaign.call(controller, eventStub);

            // then
            assert.false(controller.showGARModal);
          });
        });

        module('user is not authenticated', function () {
          test('should show GAR modal', async function (assert) {
            // given
            const campaignCode = 'LINKTOTHEPAST';
            const storeStub = {
              findRecord: sinon
                .stub()
                .withArgs('verified-code', campaignCode)
                .resolves({
                  id: campaignCode,
                  campaign: { id: 1, code: campaignCode },
                }),
              queryRecord: sinon
                .stub()
                .withArgs('organization-to-join', { code: campaignCode })
                .resolves({ identityProvider: 'GAR' }),
            };
            stubSessionService(this.owner, { isAuthenticated: false });
            controller.set('store', storeStub);
            controller.set('campaignCode', campaignCode);

            // when
            await controller.actions.startCampaign.call(controller, eventStub);

            // then
            assert.true(controller.showGARModal);
          });
        });
      });
    });

    test('should set error when no campaign found with code', async function (assert) {
      // given
      const campaignCode = 'azerty1';
      controller.set('campaignCode', campaignCode);
      const storeStub = {
        findRecord: sinon
          .stub()
          .withArgs('verified-code', campaignCode)
          .rejects({ errors: [{ status: '404' }] }),
      };
      controller.set('store', storeStub);

      // when
      await controller.actions.startCampaign.call(controller, eventStub);

      // then
      assert.strictEqual(
        controller.get('apiErrorMessage'),
        controller.intl.t('pages.fill-in-campaign-code.errors.not-found'),
      );
    });

    test('should set error when student is not authorized in campaign', async function (assert) {
      // given
      const campaignCode = 'azerty1';
      controller.set('campaignCode', campaignCode);
      const storeStub = {
        findRecord: sinon
          .stub()
          .withArgs('verified-code', campaignCode)
          .rejects({ errors: [{ status: '403' }] }),
      };
      controller.set('store', storeStub);

      // When
      await controller.actions.startCampaign.call(controller, eventStub);

      // then
      assert.strictEqual(
        controller.get('apiErrorMessage'),
        'Oups ! nous ne parvenons pas à vous trouver. Vérifiez vos informations afin de continuer ou prévenez l’organisateur.',
      );
    });
  });

  module('get isUserAuthenticatedByPix', function () {
    test('should return session.isAuthenticated', function (assert) {
      // given
      const sessionService = stubSessionService(this.owner, { isAuthenticated: true });
      stubCurrentUserService(this.owner);

      // when
      const isUserAuthenticatedByPix = controller.isUserAuthenticatedByPix;

      // then
      assert.strictEqual(isUserAuthenticatedByPix, sessionService.isAuthenticated);
    });
  });

  module('get isUserAuthenticatedByGAR', function () {
    test('returns true if an external user token is present', function (assert) {
      // given
      stubSessionService(this.owner, { isAuthenticatedByGar: true });
      stubCurrentUserService(this.owner);

      // when
      const isUserAuthenticatedByGAR = controller.isUserAuthenticatedByGAR;

      // then
      assert.true(isUserAuthenticatedByGAR);
    });

    test('returns false if there is no external user token in session', function (assert) {
      // given
      stubSessionService(this.owner, { isAuthenticatedByGar: false });
      stubCurrentUserService(this.owner);

      // when
      const isUserAuthenticatedByGAR = controller.isUserAuthenticatedByGAR;

      // then
      assert.false(isUserAuthenticatedByGAR);
    });
  });
});
