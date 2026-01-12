import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module(
  'Unit | Controller | authenticated/combined-course-blueprints/combined-course-blueprint/organizations',
  function (hooks) {
    setupTest(hooks);
    let controller;

    hooks.beforeEach(function () {
      controller = this.owner.lookup(
        'controller:authenticated.combined-course-blueprints.combined-course-blueprint.organizations',
      );
    });

    module('#updateFilters', function () {
      module('updating name', function () {
        test('it should update controller name field', async function (assert) {
          // given
          controller.name = 'someName';
          const expectedValue = 'someOtherName';

          // when
          await controller.updateFilters({ name: expectedValue });

          // then
          assert.strictEqual(controller.name, expectedValue);
        });
      });

      module('updating type', function () {
        test('it should update controller type field', async function (assert) {
          // given
          controller.type = 'someType';
          const expectedValue = 'someOtherType';

          // when
          await controller.updateFilters({ type: expectedValue });

          // then
          assert.strictEqual(controller.type, expectedValue);
        });
      });

      module('updating externalId', function () {
        test('it should update controller externalId field', async function (assert) {
          // given
          controller.externalId = 'someExternalId';
          const expectedValue = 'someOtherExternalId';

          // when
          await controller.updateFilters({ externalId: expectedValue });

          // then
          assert.strictEqual(controller.externalId, expectedValue);
        });
      });

      module('updating administrationTeam', function () {
        test('it should update controller administrationTeam field', async function (assert) {
          // given
          controller.administrationTeamId = 'team1';
          const expectedValue = 'teamId';

          // when
          await controller.updateFilters({ administrationTeamId: expectedValue });

          // then
          assert.strictEqual(controller.administrationTeamId, expectedValue);
        });
      });

      module('updating hideArchived', function () {
        test('it should update controller hideArchived field', async function (assert) {
          // given
          controller.hideArchived = false;
          const expectedValue = true;

          // when
          await controller.updateFilters({ hideArchived: expectedValue });

          // then
          assert.strictEqual(controller.hideArchived, expectedValue);
        });
      });

      module('updating id', function () {
        test('it should update controller id field', async function (assert) {
          // given
          controller.id = '12';
          const expectedValue = '987';

          // when
          await controller.updateFilters({ id: expectedValue });

          // then
          assert.strictEqual(controller.id, expectedValue);
        });
      });
    });
  },
);
