import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | Combined Course | Process custom passages', function (hooks) {
  setupTest(hooks);

  let route, replaceWithStub;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:combined-courses.process-custom-passages');
    const paramForStub = sinon.stub(route, 'paramsFor');
    replaceWithStub = sinon.stub(route.router, 'replaceWith');

    paramForStub.withArgs('combined-courses').returns({ code: 'test-code' });
  });

  module('#beforeModel', function () {
    test('should redirect to combined course home page when user is not redirect from result campaign page', function (assert) {
      // given
      const transition = {
        from: { name: 'some.other.route' },
      };

      // when
      route.beforeModel(transition);

      // then
      assert.ok(replaceWithStub.calledWithExactly('combined-courses', 'test-code'));
    });

    test('should not call transition if user came from campaign result', function (assert) {
      // given
      const transition = {
        from: { name: 'campaigns.assessment.results' },
      };

      // when
      route.beforeModel(transition);

      // then
      assert.ok(replaceWithStub.notCalled);
    });
  });
});
