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
  module('#reassessStatus', function () {
    test('should send a PATCH request to reassess combined course status', async function (assert) {
      // when
      await adapter.reassessStatus('MONCODEE1');

      // then
      assert.true(
        adapter.ajax.calledWith(`${ENV.APP.API_HOST}/api/combined-courses/MONCODEE1/reassess-status`, 'PATCH'),
      );
    });
  });
  module('#urlForFindRecord', function () {
    test('should format request with given code as query param ', async function (assert) {
      // when
      const result = adapter.urlForFindRecord(undefined, 'combined-course', { record: { code: 'MONCODEE1' } });

      // then
      assert.strictEqual(result, `${ENV.APP.API_HOST}/api/combined-courses?filter[code]=MONCODEE1`);
    });
  });
});
