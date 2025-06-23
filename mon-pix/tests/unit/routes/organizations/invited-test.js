import EmberObject from '@ember/object';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | Invited', function (hooks) {
  setupTest(hooks);

  let route, campaign, organizationToJoin;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:organizations.invited');
    route.modelFor = sinon.stub();
    route.router = { replaceWith: sinon.stub(), transitionTo: sinon.stub() };
    route.accessStorage = { isAssociationDone: sinon.stub() };
    route.session.requireAuthenticationAndApprovedTermsOfService = sinon.stub();
  });

  module('#beforeModel', function () {
    test('should redirect to entry point when /prescrit is directly set in the url', async function (assert) {
      //when
      await route.beforeModel({ from: null });

      //then
      sinon.assert.calledWith(route.router.replaceWith, 'campaigns.entry-point');
      assert.ok(true);
    });

    test('should continue en entrance route when from is set', async function (assert) {
      //when
      await route.beforeModel({ from: 'campaigns.entry-point' });

      //then
      sinon.assert.notCalled(route.router.replaceWith);
      assert.ok(true);
    });
  });

  module('#model', function () {
    test('should load model', async function (assert) {
      //when
      await route.model();

      //then
      sinon.assert.calledWith(route.modelFor, 'organizations');
      assert.ok(true);
    });
  });

  module('#afterModel', function () {
    module('reconciliation', function () {
      test('should redirect to reconciliation invited page when association is needed', async function (assert) {
        //given
        campaign = EmberObject.create({ organizationId: 1 });
        organizationToJoin = EmberObject.create({ id: 1, isReconciliationRequired: true });

        route.accessStorage.isAssociationDone.withArgs(organizationToJoin.id).returns(false);

        //when
        await route.afterModel({ campaign, organizationToJoin });

        //then
        const expectedResult = route.router.replaceWith.calledWithExactly(
          'organizations.invited.reconciliation',
          campaign.code,
        );
        assert.true(expectedResult);
      });

      test('should redirect to fill in participant external page when association is already done', async function (assert) {
        //given
        campaign = EmberObject.create({ organizationId: 1 });
        organizationToJoin = EmberObject.create({ id: 1, isReconciliationRequired: true });

        route.accessStorage.isAssociationDone.withArgs(campaign.organizationId).returns(true);

        //when
        await route.afterModel({ campaign, organizationToJoin });

        //then
        const expectedResult = route.router.replaceWith.calledWithExactly(
          'campaigns.fill-in-participant-external-id',
          campaign.code,
        );
        assert.true(expectedResult);
      });
    });

    module('student sco', function () {
      test('should redirect student sco invited page when association is needed', async function (assert) {
        //given
        campaign = EmberObject.create({ organizationId: 1 });
        organizationToJoin = EmberObject.create({ id: 1, isRestricted: true, type: 'SCO' });

        route.accessStorage.isAssociationDone.withArgs(organizationToJoin.id).returns(false);

        //when
        await route.afterModel({ campaign, organizationToJoin });

        //then
        const expectedResult = route.router.replaceWith.calledWithExactly(
          'organizations.invited.student-sco',
          campaign.code,
        );
        assert.true(expectedResult);
      });

      test('should redirect to fill in participant external page when association is already done', async function (assert) {
        //given
        campaign = EmberObject.create({ organizationId: 1 });
        organizationToJoin = EmberObject.create({ id: 1, isRestricted: true, type: 'SCO' });

        route.accessStorage.isAssociationDone.withArgs(organizationToJoin.id).returns(true);

        //when
        await route.afterModel({ campaign, organizationToJoin });

        //then
        const expectedResult = route.router.replaceWith.calledWithExactly(
          'campaigns.fill-in-participant-external-id',
          campaign.code,
        );
        assert.true(expectedResult);
      });
    });

    module('student sup', function () {
      test('should redirect student sup invited page when association is needed', async function (assert) {
        //given
        campaign = EmberObject.create({ organizationId: 1 });
        organizationToJoin = EmberObject.create({ id: 1, isRestricted: true, type: 'SUP' });
        route.accessStorage.isAssociationDone.withArgs(organizationToJoin.id).returns(false);

        //when
        await route.afterModel({ campaign, organizationToJoin });

        //then
        const expectedResult = route.router.replaceWith.calledWithExactly(
          'organizations.invited.student-sup',
          campaign.code,
        );
        assert.true(expectedResult);
      });

      test('should redirect to fill in participant external page when association is already done', async function (assert) {
        //given
        campaign = EmberObject.create({ organizationId: 1 });
        organizationToJoin = EmberObject.create({ id: 1, isRestricted: true, type: 'SUP' });
        route.accessStorage.isAssociationDone.withArgs(campaign.organizationId).returns(true);

        //when
        await route.afterModel({ campaign, organizationToJoin });

        //then
        const expectedResult = route.router.replaceWith.calledWithExactly(
          'campaigns.fill-in-participant-external-id',
          campaign.code,
        );
        assert.true(expectedResult);
      });
    });

    test('should redirect to fill in participant external otherwise', async function (assert) {
      //given
      route.accessStorage.isAssociationDone.withArgs(campaign.organizationId).returns(false);
      campaign = EmberObject.create({ organizationId: 1 });
      organizationToJoin = EmberObject.create({ id: 1, isRestricted: false });

      //when
      await route.afterModel({ campaign, organizationToJoin });

      //then
      sinon.assert.calledWith(route.router.replaceWith, 'campaigns.fill-in-participant-external-id', campaign.code);
      assert.ok(true);
    });
  });
});
