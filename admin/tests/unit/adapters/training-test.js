import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | Training ', function (hooks) {
  setupTest(hooks);
  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:training');
  });

  module('#attachTargetProfile', function () {
    test('should trigger an ajax call with the right url, method and payload', async function (assert) {
      // given
      sinon.stub(adapter, 'ajax').resolves();
      const trainingId = 1;
      const expectedPayload = {
        data: { 'target-profile-ids': ['123', '456'] },
      };
      const expectedUrl = `http://localhost:3000/api/admin/trainings/${trainingId}/attach-target-profiles`;

      // when
      await adapter.attachTargetProfile({ trainingId, targetProfileIds: ['123', '456'] });

      // then
      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'POST', expectedPayload);
      assert.ok(true);
    });
  });
  module('#detachTargetProfile', function () {
    test('should trigger an ajax call with the right url, method and payload', async function (assert) {
      // given
      sinon.stub(adapter, 'ajax').resolves();
      const trainingId = 1;
      const targetProfileId = 2;
      const expectedUrl = `http://localhost:3000/api/admin/trainings/${trainingId}/target-profiles/${targetProfileId}`;

      // when
      await adapter.detachTargetProfile({ trainingId, targetProfileId });

      // then
      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'DELETE');
      assert.ok(true);
    });
  });
  module('#duplicate', function () {
    test('should trigger an ajax call with the right url and method', async function (assert) {
      // given
      const trainingId = 1;
      sinon.stub(adapter, 'ajax').resolves();
      const expectedUrl = `http://localhost:3000/api/admin/trainings/${trainingId}/duplicate`;

      // when
      await adapter.duplicate(trainingId);

      // then
      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'POST');
      assert.ok(true);
    });
  });
});
