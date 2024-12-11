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

  module('model', function () {
    test('fetch analysis by tubes data', async function (assert) {
      // given
      const route = this.owner.lookup('route:authenticated/statistics');
      const store = this.owner.lookup('service:store');

      const organizationId = Symbol('organization-id');
      const analysisByTubes = Symbol('analysis-by-tubes');

      route.currentUser = { organization: { id: organizationId } };

      const queryRecord = sinon.stub(store, 'queryRecord');

      queryRecord.withArgs('analysis-by-tube', { organizationId }).resolves(analysisByTubes);

      // when
      const result = await route.model();

      // then
      assert.deepEqual(result, analysisByTubes);
    });
  });
});
