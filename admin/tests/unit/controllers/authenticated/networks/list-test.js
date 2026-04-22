import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Controller | authenticated/networks/list', function (hooks) {
  setupTest(hooks);
  let controller;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated.networks.list');
  });

  module('#_updateFilter', function () {
    test('it updates the name field', async function (assert) {
      // given
      controller.name = 'ancien';

      // when
      await controller._updateFilter({ name: 'nouveau' });

      // then
      assert.strictEqual(controller.name, 'nouveau');
    });

    test('it resets pageNumber to 1 when a filter changes', async function (assert) {
      // given
      controller.pageNumber = 3;

      // when
      await controller._updateFilter({ name: 'Bretagne' });

      // then
      assert.strictEqual(controller.pageNumber, 1);
    });
  });

  module('#onResetFilter', function () {
    test('it resets the name filter to null', function (assert) {
      // given
      controller.name = 'Bretagne';

      // when
      controller.onResetFilter();

      // then
      assert.strictEqual(controller.name, null);
    });
  });
});
