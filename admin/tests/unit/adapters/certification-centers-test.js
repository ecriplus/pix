import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | certification centers', function (hooks) {
  setupTest(hooks);

  module('#archiveCertificationCenter', function () {
    test('should build get url from certification details id', function (assert) {
      // given
      const adapter = this.owner.lookup('adapter:certification-center');

      sinon.stub(adapter, 'ajax');

      // when
      adapter.archiveCertificationCenter(123);

      // then
      assert.ok(adapter.ajax.calledWith('http://localhost:3000/api/admin/certification-centers/123/archive', 'POST'));
    });
  });
});
