import { setupTest } from 'ember-qunit';
import createGlimmerComponent from 'mon-pix/tests/helpers/create-glimmer-component';
import Location from 'mon-pix/utils/location';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Component | Assessments | Live alert', function (hooks) {
  setupTest(hooks);

  let reloadStub;

  hooks.beforeEach(function () {
    reloadStub = sinon.stub(Location, 'reload');
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  module('#refreshPage', function () {
    test('should refresh page', async function (assert) {
      // given
      const component = createGlimmerComponent('assessments/live-alert');

      // when
      await component.refreshPage();

      // then
      sinon.assert.calledOnce(reloadStub);
      assert.ok(true);
    });
  });
});
