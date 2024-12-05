import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/statistics', function (hooks) {
  setupTest(hooks);

  module('beforeModel', function () {
    test('should not redirect to application when canAccessStatisticsPage is true', function (assert) {
      // given
      class CurrentUserStub extends Service {
        canAccessStatisticsPage = true;
      }

      this.owner.register('service:current-user', CurrentUserStub);
      const route = this.owner.lookup('route:authenticated/statistics');
      sinon.stub(route.router, 'replaceWith');

      const expectedRedirection = 'application';
      // when
      route.beforeModel();

      // then
      assert.notOk(route.router.replaceWith.calledWith(expectedRedirection));
    });

    test('should redirect to application when canAccessStatisticsPage is false', function (assert) {
      // given
      class CurrentUserStub extends Service {
        canAccessStatisticsPage = false;
      }

      this.owner.register('service:current-user', CurrentUserStub);
      const route = this.owner.lookup('route:authenticated/statistics');
      sinon.stub(route.router, 'replaceWith');

      const expectedRedirection = 'application';
      // when
      route.beforeModel();

      // then
      assert.ok(route.router.replaceWith.calledWith(expectedRedirection));
    });
  });
});
