import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Unit | Controller | authenticated/combined-course/participations', function (hooks) {
  setupIntlRenderingTest(hooks);
  let controller;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated/combined-course/participations');
  });
  module('#clearFilters', function () {
    test('it should clear filters', function (assert) {
      // given
      controller.fullName = 'nom1';
      controller.statuses = ['STARTED'];

      // when
      controller.clearFilters();

      // then
      assert.strictEqual(controller.fullName, '');
      assert.deepEqual(controller.statuses, []);
    });
  });
  module('#triggerFiltering', function () {
    module('when the filters contain defined values', function () {
      test('update value', async function (assert) {
        // given
        controller.fullName = 'nom1';
        controller.statuses = [];

        // when
        controller.triggerFiltering('fullName', 'nom2');
        controller.triggerFiltering('statuses', ['STARTED']);

        // then
        assert.strictEqual(controller.fullName, 'nom2');
        assert.deepEqual(controller.statuses, ['STARTED']);
      });
    });
  });
});
