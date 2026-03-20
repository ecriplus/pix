import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | user certifications/get', function (hooks) {
  setupTest(hooks);

  let route;
  let findRecordStub;
  const certificationId = 'certification_id';

  hooks.beforeEach(function () {
    findRecordStub = sinon.stub();
    const storeStub = Service.create({
      findRecord: findRecordStub,
    });

    route = this.owner.lookup('route:authenticated/user-certifications/get');
    route.set('store', storeStub);
    route.router.transitionTo = sinon.stub().resolves();
  });

  module('#model', function () {
    test('should get the certification', async function (assert) {
      // given
      const params = { id: certificationId };
      findRecordStub.resolves({});

      // when
      await route.model(params);

      // then
      sinon.assert.calledOnce(findRecordStub);
      sinon.assert.calledWith(findRecordStub, 'certification', certificationId);
      assert.ok(true);
    });
  });

  module('#beforeModel', function () {
    test('should not redirect when the certificate summary is validated', function (assert) {
      // given
      const certificateSummaries = [{ id: '2', isValidated: true }];
      sinon.stub(route, 'modelFor').withArgs('authenticated.user-certifications').returns(certificateSummaries);
      const transition = { to: { params: { id: '2' } }, abort: sinon.stub() };

      // when
      route.beforeModel(transition);

      // then
      assert.true(transition.abort.notCalled);
      assert.true(route.router.transitionTo.notCalled);
    });

    test('should return to /mes-certifications when the certification is not published', function (assert) {
      // given
      const certificateSummaries = [{ id: '2', isValidated: false }];
      sinon.stub(route, 'modelFor').withArgs('authenticated.user-certifications').returns(certificateSummaries);
      const transition = { to: { params: { id: '2' } }, abort: sinon.stub() };

      // when
      route.beforeModel(transition);

      // then
      sinon.assert.calledOnce(transition.abort);
      sinon.assert.calledOnce(route.router.transitionTo);
      sinon.assert.calledWith(route.router.transitionTo, 'authenticated.user-certifications');
      assert.ok(true);
    });

    test('should return to /mes-certifications when the certification is not validated', function (assert) {
      // given
      const certificateSummaries = [{ id: '3', isValidated: false }];
      sinon.stub(route, 'modelFor').withArgs('authenticated.user-certifications').returns(certificateSummaries);
      const transition = { to: { params: { id: '3' } }, abort: sinon.stub() };

      // when
      route.beforeModel(transition);

      // then
      sinon.assert.calledOnce(transition.abort);
      sinon.assert.calledOnce(route.router.transitionTo);
      sinon.assert.calledWith(route.router.transitionTo, 'authenticated.user-certifications');
      assert.ok(true);
    });

    test('should return to /mes-certifications when the certificate summary is not found', function (assert) {
      // given
      const certificateSummaries = [{ id: '2', isValidated: true }];
      sinon.stub(route, 'modelFor').withArgs('authenticated.user-certifications').returns(certificateSummaries);
      const transition = { to: { params: { id: '999' } }, abort: sinon.stub() };

      // when
      route.beforeModel(transition);

      // then
      sinon.assert.calledOnce(transition.abort);
      sinon.assert.calledOnce(route.router.transitionTo);
      sinon.assert.calledWith(route.router.transitionTo, 'authenticated.user-certifications');
      assert.ok(true);
    });
  });
});
