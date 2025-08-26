import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated', function (hooks) {
  setupTest(hooks);

  module('beforeModel', function () {
    test('should abort transition if user not logged in', async function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated');
      const transition = { isAborted: true };
      const requireAuthenticationStub = sinon.stub(route.session, 'requireAuthentication');
      const replaceWithStub = sinon.stub(route.router, 'replaceWith');

      // when
      route.beforeModel(transition);

      // then
      assert.ok(requireAuthenticationStub.calledWith(transition, 'login'));
      assert.notOk(replaceWithStub.called);
    });

    test('should redirect towards cgu if not accepted yet', async function (assert) {
      // given
      const organizationId = Symbol('organizationId');

      class CurrentUserStub extends Service {
        prescriber = { placesManagement: true, pixOrgaTermsOfServiceStatus: 'requested' };
        organization = {
          id: organizationId,
        };
      }

      const route = this.owner.lookup('route:authenticated');
      const transition = { isAborted: false };

      sinon.stub(route.session, 'requireAuthentication');

      const replaceWithStub = sinon.stub(route.router, 'replaceWith');

      this.owner.register('service:current-user', CurrentUserStub);

      // when
      route.beforeModel(transition);

      // then
      assert.ok(replaceWithStub.calledWithExactly('terms-of-service'));
    });

    test('should not redirect towards cgu if already accepted yet', async function (assert) {
      // given
      const organizationId = Symbol('organizationId');

      class CurrentUserStub extends Service {
        prescriber = {
          placesManagement: true,
          pixOrgaTermsOfServiceStatus: 'accepted',
        };
        organization = {
          id: organizationId,
        };
      }

      const route = this.owner.lookup('route:authenticated');
      const transition = { isAborted: false };

      sinon.stub(route.session, 'requireAuthentication');

      const replaceWithStub = sinon.stub(route.router, 'replaceWith');

      this.owner.register('service:current-user', CurrentUserStub);

      // when
      route.beforeModel(transition);

      // then
      assert.notOk(replaceWithStub.calledWithExactly('terms-of-service'));
    });
  });
});
