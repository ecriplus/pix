import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/networks/list', function (hooks) {
  setupTest(hooks);
  let route;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/networks/list');
    route.store.query = sinon.stub().resolves();
  });

  module('#model', function () {
    test('it passes page params and empty filter to store.query when no filter is given', async function (assert) {
      // when
      await route.model({ pageNumber: 1, pageSize: 10, name: null });

      // then
      sinon.assert.calledWith(route.store.query, 'network', {
        filter: { name: '' },
        page: { number: 1, size: 10 },
      });
      assert.ok(true);
    });

    test('it passes trimmed name filter to store.query', async function (assert) {
      // when
      await route.model({ pageNumber: 2, pageSize: 10, name: '  Bretagne  ' });

      // then
      sinon.assert.calledWith(route.store.query, 'network', {
        filter: { name: 'Bretagne' },
        page: { number: 2, size: 10 },
      });
      assert.ok(true);
    });
  });
});
