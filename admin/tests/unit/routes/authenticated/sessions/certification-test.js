import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/sessions/certification', function (hooks) {
  setupTest(hooks);

  module('#beforeModel', function () {
    test('it should check if current user is super admin, certif, or support', function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/sessions/certification');

      const restrictAccessToStub = sinon.stub().returns();
      class AccessControlStub extends Service {
        restrictAccessTo = restrictAccessToStub;
      }
      this.owner.register('service:access-control', AccessControlStub);

      // when
      route.beforeModel();

      // then
      assert.ok(restrictAccessToStub.calledWith(['isSuperAdmin', 'isCertif', 'isSupport'], 'authenticated'));
    });
  });

  module('#error', function () {
    test('it should notify the error and transition to sessions list', function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/sessions/certification');
      const error = new Error('Test error');

      const notifyStub = sinon.stub();
      class ErrorNotifierStub extends Service {
        notify = notifyStub;
      }
      this.owner.register('service:error-notifier', ErrorNotifierStub);

      const transitionToStub = sinon.stub(this.owner.lookup('service:router'), 'transitionTo');

      // when
      route.error(error);

      // then
      assert.ok(notifyStub.calledWith(error));
      assert.ok(transitionToStub.calledWith('authenticated.sessions'));
    });
  });
});
