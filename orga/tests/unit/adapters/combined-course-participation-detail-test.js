import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapters | combined-course-participation-detail', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:combined-course-participation-detail');
    adapter.ajax = sinon.stub().resolves();
  });

  module('#urlForQueryRecord', () => {
    test('should build query record url', async function (assert) {
      const combinedCourseId = 123;
      const participationId = 456;
      const query = { combinedCourseId, participationId };
      const url = await adapter.urlForQueryRecord(query);

      assert.ok(url.endsWith(`api/combined-courses/${combinedCourseId}/participations/${participationId}`));
      assert.strictEqual(query.combinedCourseId, undefined);
      assert.strictEqual(query.participationId, undefined);
    });
  });
});
