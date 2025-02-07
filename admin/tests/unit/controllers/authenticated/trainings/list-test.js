import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Controller | authenticated/trainings/list', function (hooks) {
  setupTest(hooks);
  let controller;

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated/trainings/list');
  });

  module('#updateFilters', function () {
    module('updating id', function () {
      test('it should update controller id field', async function (assert) {
        // given
        controller.id = 1;
        const expectedValue = 2;

        // when
        await controller.updateFilters({ id: expectedValue });

        // then
        assert.strictEqual(controller.id, expectedValue);
      });
    });

    module('updating internalTitle', function () {
      test('it should update controller internalTitle field', async function (assert) {
        // given
        controller.internalTitle = 'someTitle';
        const expectedValue = 'someOtherTitle';

        // when
        await controller.updateFilters({ internalTitle: expectedValue });

        // then
        assert.strictEqual(controller.internalTitle, expectedValue);
      });
    });
  });
});
