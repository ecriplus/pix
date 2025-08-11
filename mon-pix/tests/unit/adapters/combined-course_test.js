import { setupTest } from 'ember-qunit';
import ENV from 'mon-pix/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapters | combined-course', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:combined-course');
    sinon.stub(adapter, 'ajax');
  });

  module('#start', function () {
    test('should send a PUT request to start a combined course', async function (assert) {
      // when
      const code = 'code';
      await adapter.start(code);

      // then
      assert.true(adapter.ajax.calledWith(`${ENV.APP.API_HOST}/api/combined-courses/code/start`, 'PUT'));
    });
  });
});
